const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, param, validationResult } = require('express-validator');
const {  authorizeRoles } = require('../../utils/verify');

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateSmtpDetails = [
  body('host').notEmpty().withMessage('Host is required'),
  body('port').isInt({ min: 1, max: 65535 }).withMessage('Port must be a valid number between 1 and 65535'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('encryption').isIn(['TLS', 'SSL', 'NONE']).withMessage('Invalid encryption type')
];

// Create or Update SMTP Details
router.post('/', validateSmtpDetails, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { host, port, username, password, encryption, userId } = req.body;
    const targetUserId = userId || req.user.userId;

    // Check if SMTP details already exist for the user
    const existingSmtpDetails = await prisma.smtpDetails.findUnique({
      where: { userId: targetUserId }
    });

    let smtpDetails;
    let activityType;
    let description;

    if (existingSmtpDetails) {
      // If SMTP details exist, update the existing record
      smtpDetails = await prisma.smtpDetails.update({
        where: { userId: targetUserId },
        data: {
          host,
          port: Number(port),
          username,
          password,
          encryption
        }
      });
      activityType = 'SMTP_DETAILS_UPDATED';
      description = `Updated existing SMTP details for user ${targetUserId}`;
    } else {
      // If no SMTP details exist, create a new record
      smtpDetails = await prisma.smtpDetails.create({
        data: {
          host,
          port: Number(port),
          username,
          password,
          encryption,
          userId: targetUserId
        }
      });
      activityType = 'SMTP_DETAILS_CREATED';
      description = `Created new SMTP details for user ${targetUserId}`;
    }

    // Log the activity
    await prisma.userActivityLog.create({
      data: {
        userId: req.user.userId,
        activityType,
        description,
        ipAddress: req.ip
      }
    });

    res.status(existingSmtpDetails ? 200 : 201).json(smtpDetails);
  } catch (error) {
    console.error(error);
    
    // Check for unique constraint violation (if applicable)
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'SMTP details already exist for this user' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Get SMTP Details by ID
router.get('/:id',  async (req, res) => {
  try {
    const smtpDetails = await prisma.smtpDetails.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!smtpDetails) {
      return res.status(404).json({ message: 'SMTP details not found' });
    }

    if (smtpDetails.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.userActivityLog.create({
      data: {
        userId: req.user.userId,
        activityType: 'SMTP_DETAILS_ACCESSED',
        description: `Accessed SMTP details with ID ${req.params.id}`,
        ipAddress: req.ip
      }
    });

    res.json(smtpDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get SMTP Details by User ID
router.get('/user/:userId',  async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);


    const smtpDetails = await prisma.smtpDetails.findUnique({
      where: { userId: userId }
    });

    if (!smtpDetails) {
      return res.status(404).json({ message: 'SMTP details not found for this user' });
    }

    await prisma.userActivityLog.create({
      data: {
        userId: req.user.userId,
        activityType: 'SMTP_DETAILS_ACCESSED',
        description: `Accessed SMTP details for user ${userId}`,
        ipAddress: req.ip
      }
    });

    res.json(smtpDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update SMTP Details
router.put('/:id',  validateSmtpDetails, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const smtpDetails = await prisma.smtpDetails.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!smtpDetails) {
      return res.status(404).json({ message: 'SMTP details not found' });
    }

    if (smtpDetails.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { host, port, username, password, encryption } = req.body;
    const updatedSmtpDetails = await prisma.smtpDetails.update({
      where: { id: parseInt(req.params.id) },
      data: { host, port, username, password, encryption }
    });

    await prisma.userActivityLog.create({
      data: {
        userId: req.user.userId,
        activityType: 'SMTP_DETAILS_UPDATED',
        description: `Updated SMTP details with ID ${req.params.id}`,
        ipAddress: req.ip
      }
    });

    res.json(updatedSmtpDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete SMTP Details
router.delete('/:id',  async (req, res) => {
  try {
    const smtpDetails = await prisma.smtpDetails.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!smtpDetails) {
      return res.status(404).json({ message: 'SMTP details not found' });
    }

    if (smtpDetails.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.smtpDetails.delete({
      where: { id: parseInt(req.params.id) }
    });

    await prisma.userActivityLog.create({
      data: {
        userId: req.user.userId,
        activityType: 'SMTP_DETAILS_DELETED',
        description: `Deleted SMTP details with ID ${req.params.id}`,
        ipAddress: req.ip
      }
    });

    res.json({ message: 'SMTP details deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;