const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } =require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();
// Create a new user activity log
router.post('/', [
  body('userId').isInt(),
  body('activityType').isString().isLength({ min: 1, max: 50 }),
  body('description').optional().isString(),
  body('ipAddress').optional().isIP(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, activityType, description, ipAddress } = req.body;
    const userActivityLog = await prisma.userActivityLog.create({
      data: {
        userId,
        activityType,
        description,
        ipAddress,
      },
    });
    res.status(201).json(userActivityLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user activity log' });
  }
});

// Get all user activity logs
router.get('/', async (req, res) => {
  try {
    const userActivityLogs = await prisma.userActivityLog.findMany();
    res.json(userActivityLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user activity logs' });
  }
});

// Get user activity log by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userActivityLog = await prisma.userActivityLog.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!userActivityLog) {
      return res.status(404).json({ error: 'User activity log not found' });
    }

    res.json(userActivityLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user activity log' });
  }
});

// Update user activity log
router.put('/:id', [
  body('activityType').optional().isString().isLength({ min: 1, max: 50 }),
  body('description').optional().isString(),
  body('ipAddress').optional().isIP(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.params.id);
    const { activityType, description, ipAddress } = req.body;

    const updatedUserActivityLog = await prisma.userActivityLog.update({
      where: { id },
      data: {
        ...(activityType && { activityType }),
        ...(description && { description }),
        ...(ipAddress && { ipAddress }),
      },
    });

    res.json(updatedUserActivityLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user activity log' });
  }
});

// Delete user activity log
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.userActivityLog.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user activity log' });
  }
});


module.exports = router;