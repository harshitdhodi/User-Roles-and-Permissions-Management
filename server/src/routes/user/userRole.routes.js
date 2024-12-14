const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();


// Validation middleware
const roleValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Role name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Role name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters')
];

// Create Role - Prisma Implementation
router.post('/prisma', roleValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const role = await prisma.role.create({
      data: { 
        name, 
        description: description || null 
      }
    });

    res.status(201).json(role);
  } catch (error) {
    console.error('Create role (Prisma) error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A role with this name already exists' });
    }

    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});



// Get All Roles - Prisma Implementation
router.get('/prisma', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const roles = await prisma.role.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.role.count();

    res.json({
      roles,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get roles (Prisma) error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});


// Get Role by ID - Prisma Implementation
router.get('/prisma/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) }
    });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json(role);
  } catch (error) {
    console.error('Get role by ID (Prisma) error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});



// Update Role - Prisma Implementation
router.put('/prisma/:id', roleValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description } = req.body;

    const role = await prisma.role.update({
      where: { id: parseInt(id) },
      data: { 
        name, 
        description: description || null 
      }
    });
    
    res.json(role);
  } catch (error) {
    console.error('Update role (Prisma) error:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A role with this name already exists' });
    }
    
    // Handle record not found
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});


// Delete Role - Prisma Implementation
router.delete('/prisma/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.role.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete role (Prisma) error:', error);
    
    // Handle record not found
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});


module.exports = router;