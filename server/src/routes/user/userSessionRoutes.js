const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../../utils/verify');

const router = express.Router();
const prisma = new PrismaClient();


// Create a new user session
router.post('/', [
  body('userId').isInt(),
  body('sessionToken').isString().isLength({ min: 1, max: 255 }),
  body('ipAddress').optional().isIP(),
  body('userAgent').optional().isString(),
  body('expiresAt').isISO8601(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, sessionToken, ipAddress, userAgent, expiresAt } = req.body;
    const userSession = await prisma.userSession.create({
      data: {
      userId,
        sessionToken,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });
    res.status(201).json(userSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user session' });
  }
});

// Get all user sessions
router.get('/', async (req, res) => {
  try {
    const userSessions = await prisma.userSession.findMany();
    res.json(userSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user sessions' });
  }
});

// Get user session by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userSession = await prisma.userSession.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!userSession) {
      return res.status(404).json({ error: 'User session not found' });
    }

    res.json(userSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user session' });
  }
});

// Update user session
router.put('/:id', [
  body('sessionToken').optional().isString().isLength({ min: 1, max: 255 }),
  body('ipAddress').optional().isIP(),
  body('userAgent').optional().isString(),
  body('expiresAt').optional().isISO8601(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.params.id);
    const { sessionToken, ipAddress, userAgent, expiresAt } = req.body;

    const updatedUserSession = await prisma.userSession.update({
      where: { id },
      data: {
        ...(sessionToken && { sessionToken }),
        ...(ipAddress && { ipAddress }),
        ...(userAgent && { userAgent }),
        ...(expiresAt && { expiresAt }),
      },
    });

    res.json(updatedUserSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user session' });
  }
});

// Delete user session
router.delete('/:userId', authenticateToken, authorizeRoles(['ADMIN']), async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'User ID must be a valid number'
      });
    }

    // Find the user's active sessions
    const existingSessions = await prisma.userSession.findMany({
      where: { userId }
    });

    // If no sessions are found, return a 404 error
    if (existingSessions.length === 0) {
      return res.status(404).json({
        error: 'No sessions found',
        message: `No active sessions found for user ID ${userId}`
      });
    }

    // Delete all sessions for the user
    const deletedSessions = await prisma.userSession.deleteMany({
      where: { userId }
    });

    // Log the deletion activity
    const adminUserId = req.user.userId; // Current admin performing the action
    await prisma.userActivityLog.create({
      data: {
        userId: adminUserId,
        activityType: 'DELETE_USER_SESSIONS',
        description: `Deleted all sessions for userId: ${userId}`,
        ipAddress: req.ip
      }
    });

    // Send success response
    res.status(200).json({
      message: `All sessions for user ID ${userId} deleted successfully`,
      deletedSessionsCount: deletedSessions.count
    });

  } catch (error) {
    console.error('Error deleting user sessions:', error);
    res.status(500).json({
      error: 'Failed to delete user sessions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});



module.exports = router;