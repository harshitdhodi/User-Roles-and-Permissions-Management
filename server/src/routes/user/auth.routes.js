const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('../../utils/verify');

const router = express.Router();
const prisma = new PrismaClient();

// JWT Secret - ensure this is a strong, unique secret in production
const JWT_SECRET = process.env.JWT_SECRET;

// Login Route
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        // role: true,
        sessions: {
          where: {
            expiresAt: { gt: new Date() } // Check for active sessions
          }
        },
        role: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    name: true,
                    description: true
                  }
                }
              }
            }
          }
        },
      }
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    if (user.sessions.length > 0) {
      return res.status(403).json({
        error: 'An active session already exists. Please logout from other devices first.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Log failed login attempt
      await prisma.userActivityLog.create({
        data: {
          userId: user.id,
          activityType: 'LOGIN_FAILED',
          description: 'Failed login attempt',
          ipAddress: req.ip
        }
      });

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Invalidate any existing sessions (soft delete)
    await prisma.userSession.updateMany({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() }
      },
      data: {
        expiresAt: new Date() // Expire existing sessions
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create new session record
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      }
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Log successful login
    await prisma.userActivityLog.create({
      data: {
        userId: user.id,
        activityType: 'LOGIN_SUCCESS',
        description: 'Successful user login',
        ipAddress: req.ip
      }
    });

    // Prepare response (exclude sensitive information)
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      token,
      user: {
        ...userWithoutPassword,
        roleName: user.role.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    // Log system error
    await prisma.userActivityLog.create({
      data: {
        userId: user.id,
        activityType: 'LOGIN_SYSTEM_ERROR',
        description: 'Login system error',
        ipAddress: req.ip
      }
    });

    res.status(500).json({
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Invalidate the session
    const updatedSession = await prisma.userSession.updateMany({
      where: {
        sessionToken: token,
        expiresAt: { gt: new Date() }
      },
      data: {
        expiresAt: new Date() // Effectively invalidates the session
      }
    });
    const currentUserId = req.user.userId;

    // Log logout activity
    await prisma.userActivityLog.create({
      data: {
        activityType: 'LOGOUT',
        description: 'User logged out',
        ipAddress: req.ip,
        userId: currentUserId
      }
    });

    res.status(200).json({
      message: 'Logout successful',
      sessionsUpdated: updatedSession.count
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// Middleware to verify JWT token
// Get Active Sessions for All Users
router.get('/active-sessions', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
  try {
    const activeSessions = await prisma.userSession.findMany({
      where: {
        expiresAt: { gt: new Date() }
      },
      select: {
        id: true,
        userId: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(activeSessions);
  } catch (error) {
    console.error('Active sessions error:', error);
    res.status(500).json({
      error: 'Failed to fetch active sessions',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});
// Terminate All Active Sessions for a User (Except Current Session)
router.post('/terminate-user-sessions', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
  try {
    const { userId } = req.user; // User ID to terminate sessions for
    const currentToken = req.headers.authorization.split(' ')[1];

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Terminate all sessions for the user except the current one
    const updatedSessions = await prisma.userSession.updateMany({
      where: {
        userId: userId,
        sessionToken: { not: currentToken }, // Exclude the current session
        expiresAt: { gt: new Date() }       // Only terminate active sessions
      },
      data: {
        expiresAt: new Date() // Set expiration to now to invalidate sessions
      }
    });

    // Log the admin activity
    const adminUserId = req.user.userId;
    await prisma.userActivityLog.create({
      data: {
        userId: adminUserId,
        activityType: 'TERMINATE_USER_SESSIONS',
        description: `Terminated all sessions for userId: ${userId}, except current session.`,
        ipAddress: req.ip
      }
    });

    res.status(200).json({
      message: `All other sessions for user ID ${userId} terminated successfully.`,
      sessionsTerminated: updatedSessions.count
    });
  } catch (error) {
    console.error('Error terminating user sessions:', error);
    res.status(500).json({
      error: 'Failed to terminate user sessions',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});


router.get('/refetch', authenticateToken, async (req, res) => {
  try {
    // Use the authenticated user's ID from the token
    const currentUserId = req.user.userId;

    // Fetch complete user details
    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        img:true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    name: true,
                    description: true
                  }
                }
              }
            }
          }
        },
        sessions: {
          select: {
            id: true,
            createdAt: true,
            ipAddress: true,
            userAgent: true,
            expiresAt: true
          },
          take: 5, // Limit to last 5 sessions
          orderBy: { id: 'desc' }
        },
        activityLogs: {
          select: {
            id: true,
            activityType: true,
            description: true,
            ipAddress: true,
            createdAt: true
          },
          take: 10, // Limit to last 10 activity logs
          orderBy: { id: 'desc' }
        }
      }
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    // Prepare response (remove any sensitive information)
    const { sessions, activityLogs, ...userDetails } = user;

    res.status(200).json({
      user: {
        ...userDetails,
        roleName: user.role.name,
        recentSessions: sessions,
        recentActivityLogs: activityLogs
      }
    });

  } catch (error) {
    console.error('User refetch error:', error);

    // Log system error
    await prisma.userActivityLog.create({
      data: {
        userId: req.user.userId,
        activityType: 'REFETCH_SYSTEM_ERROR',
        description: 'User data refetch system error',
        ipAddress: req.ip
      }
    });

    res.status(500).json({
      error: 'Refetch failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});
// Expose the router and verification middleware
module.exports = router;