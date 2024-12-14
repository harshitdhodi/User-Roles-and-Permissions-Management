const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } =require('express-validator');
const prisma = new PrismaClient();
const router = express.Router();

// Create a new password reset token
router.post('/', [
  body('userId').isInt(),
  body('token').isString().isLength({ min: 1, max: 255 }),
  body('expiresAt').isISO8601(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, token, expiresAt } = req.body;
    const passwordResetToken = await prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
    res.status(201).json(passwordResetToken);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Failed to create password reset token' });
  }
});

// Get all password reset tokens
router.get('/', async (req, res) => {
  try {
    const passwordResetTokens = await prisma.passwordResetToken.findMany();
    res.json(passwordResetTokens);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Failed to fetch password reset tokens' });
  }
});

// Get password reset token by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!passwordResetToken) {
      return res.status(404).json({ error: 'Password reset token not found' });
    }

    res.json(passwordResetToken);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch password reset token' });
  }
});

// Update password reset token
router.put('/:id', [
  body('token').optional().isString().isLength({ min: 1, max: 255 }),
  body('expiresAt').optional().isISO8601(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.params.id);
    const { token, expiresAt } = req.body;

    const updatedPasswordResetToken = await prisma.passwordResetToken.update({
      where: { id },
      data: {
        ...(token && { token }),
        ...(expiresAt && { expiresAt }),
      },
    });

    res.json(updatedPasswordResetToken);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update password reset token' });
  }
});

// Delete password reset token
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.passwordResetToken.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete password reset token' });
  }
});


module.exports = router;