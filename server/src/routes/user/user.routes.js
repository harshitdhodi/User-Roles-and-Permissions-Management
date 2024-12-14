const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('../../utils/verify');
const { z } = require('zod');
const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware for user creation/update
const userValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email address')
    .isLength({ max: 100 }).withMessage('Email cannot exceed 100 characters'),
  
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must include uppercase, lowercase, number, and special character'),
  
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  
  body('roleId')
    .isInt().withMessage('Role ID must be an integer')
    .toInt()
];

const userIdSchema = z.object({
  id: z.union([
    z.string().uuid(),  // UUID string
    z.string().min(1),  // Non-empty string ID
    z.number().int().positive()  // Positive integer ID
  ])
});

const queryParamsSchema = z.object({
  // Add optional query parameters here
  // For example:
  include: z.string().optional(),
  fields: z.string().optional(),
  // Add more optional parameters as needed
}).optional();

// Middleware to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Create User
router.post('/', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      roleId 
    } = req.body;

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: 'Username or email already exists',
        conflictField: existingUser.username === username ? 'username' : 'email'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        roleId:Number(roleId),
        lastLogin: null
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        roleId: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// Get All Users with Advanced Filtering and Sorting
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      isActive 
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const where = {
      OR: search ? [
        { username: { contains: search } },
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } }
      ] : undefined,
      isActive: isActive !== undefined ? (isActive === 'true') : undefined
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take: limitNum,
        skip: offset,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true,
          lastLogin: true,
          img: true,
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
            where: {
              expiresAt: { gt: new Date() } // Only include active sessions
            },
            select: {
              id: true,
              ipAddress: true,
              userAgent: true,
              expiresAt: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              sessions: true,
              activityLogs: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// Get User by ID with Detailed Information
router.get('/:id', 
  authenticateToken,
  // authorizeRoles(['ADMIN', 'MANAGER']),
  async (req, res) => {
    try {
      // Validate user ID
      const validatedId = userIdSchema.parse(req.params);
      
      // Validate optional query parameters
      const queryParams = queryParamsSchema.parse(req.query);
 
    // Check if the requested user matches the authenticated user or if user has admin role
      // if (req.user.userId !== Number(validatedId.id)) {
      //   return res.status(403).json({ message: 'Access denied' });
      // }
      const user = await prisma.user.findUnique({
        where: { id: Number(validatedId.id) },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          img: true,
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
            take: queryParams.sessionLimit,
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
            take: queryParams.activityLimit,
            orderBy: { id: 'desc' }
          }
        }
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Log user profile access
      await prisma.userActivityLog.create({
        data: {
          userId: req.user.userId,
          activityType: 'PROFILE_ACCESS',
          description: `Accessed profile of user ${validatedId.id}`,
          ipAddress: req.ip
        }
      });
      
      res.json(user);
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input', 
          errors: error.errors 
        });
      }

      console.error('Get user by ID error:', error);
      
      // Log system error
      await prisma.userActivityLog.create({
        data: {
          userId: req.user.userId,
          activityType: 'PROFILE_ACCESS_ERROR',
          description: 'Error accessing user profile',
          ipAddress: req.ip
        }
      });

      res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
      });
    }
  }
);

// Update User Profile (Partial Update)
router.patch('/:id', 
  authenticateToken,
  authorizeRoles(['ADMIN', 'MANAGER']),
  async (req, res) => {
    try {
      const validatedId = userIdSchema.parse(req.params);
      
      // Check if the authenticated user has permission to update
      if (req.user.userId !== validatedId.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Define allowed fields for update
      const updateSchema = z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        isActive: z.boolean().optional()
      });

      const validatedData = updateSchema.parse(req.body);

      const updatedUser = await prisma.user.update({
        where: { id: validatedId.id },
        data: validatedData,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          isActive: true
        }
      });

      // Log profile update
      await prisma.userActivityLog.create({
        data: {
          userId: req.user.userId,
          activityType: 'PROFILE_UPDATE',
          description: `Updated profile of user ${validatedId.id}`,
          ipAddress: req.ip
        }
      });

      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input', 
          errors: error.errors 
        });
      }

      console.error('Update user error:', error);
      res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
      });
    }
  }
);

// Validation Schema for Role Update
const updateRoleSchema = z.object({
  roleId: z.number().int().positive().min(1, "Invalid Role ID"),
});

// Route to Update User Role
router.patch('/:id/role', 
  authenticateToken,
  authorizeRoles(['ADMIN']), // Only admins can update roles
  async (req, res) => {
    try {
      const userId=Number(req.params.id);
      // Validate Role ID from request body
      const validatedRoleData = updateRoleSchema.parse(req.body);

      // Verify the role exists (optional but recommended)
      const roleExists = await prisma.role.findUnique({
        where: { id: validatedRoleData.roleId }
      });

      if (!roleExists) {
        return res.status(400).json({ message: 'Invalid Role ID' });
      }

      // Update user's role
     const updatedUser= await prisma.user.update({
        where: { id: userId }, // The user's ID
        data: { 
          roleId: validatedRoleData.roleId // The new role ID
        },
        select: {
          id: true, // Returning the updated user's ID
          username: true, // Returning the updated user's username
          roleId: true, // Returning the updated role ID
          role: {      // Returning the role details
            select: {
              id: true,
              name: true,
            }
          }
        }
      });
      

      // Log role change activity
      await prisma.userActivityLog.create({
        data: {
          userId: userId,
          activityType: 'ROLE_UPDATE',
          description: `Updated role for user ${userId} to role ID ${validatedRoleData.roleId}`,
          ipAddress: req.ip
        }
      });

      res.json({
        message: 'User role updated successfully',
        user: updatedUser
      });

    } catch (error) {
      // Specific error handling
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input', 
          errors: error.errors 
        });
      }

      console.error('Update user role error:', error);
      res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
      });
    }
  }
);


// Soft Delete / Deactivate User
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { 
        isActive: false 
      },
      select: {
        id: true,
        username: true,
        isActive: true
      }
    });

    res.json({
      message: 'User deactivated successfully',
      user
    });
  } catch (error) {
    // console.error('Delete user error:', error);
    
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// Route to Toggle User Active Status
router.patch('/:id/status', 
  authenticateToken,
  authorizeRoles(['ADMIN']), // Only admins can update user status
  async (req, res) => {
    try {
      const userId = Number(req.params.id);

      // Fetch the current user to get existing status
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { isActive: true }
      });

      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Toggle the isActive status
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { 
          isActive: !currentUser.isActive 
        },
        select: {
          id: true,
          username: true,
          isActive: true
        }
      });

      // Log status change activity
      await prisma.userActivityLog.create({
        data: {
          userId: userId,
          activityType: 'USER_STATUS_TOGGLE',
          description: `Toggled active status for user ${userId} to ${updatedUser.isActive}`,
          ipAddress: req.ip
        }
      });

      res.json({
        message: 'User active status updated successfully',
        user: updatedUser
      });

    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({ 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
      });
    }
  }
);
module.exports = router;