const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } =require('express-validator');

const prisma = new PrismaClient();
const router = express();

// Permission Routes
// Create Permission
router.post('/', [
  body('name').isString().isLength({ min: 1, max: 50 }).trim(),
  body('description').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description } = req.body;
    const permission = await prisma.permission.create({
      data: { 
        name, 
        description: description || undefined 
      }
    });
    res.status(201).json(permission);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Failed to create permission' });
  }
});

// Get All Permissions
router.get('/', async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

// Get Permission by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    res.json(permission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch permission' });
  }
});

// Update Permission
router.put('//:id', [
  body('name').optional().isString().isLength({ min: 1, max: 50 }).trim(),
  body('description').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description })
      }
    });

    res.json(updatedPermission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update permission' });
  }
});

// Delete Permission
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.permission.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete permission' });
  }
});

// Assign Permission to Role

router.post(
  '/roles/:roleId/',
  [
    body('permissionId').isInt(), // Validate that permissionId is an integer
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const roleId = parseInt(req.params.roleId);
      const { permissionId } = req.body;

      // Check if the record already exists
      const existingRolePermission = await prisma.rolePermission.findFirst({
        where: {
          roleId,
          permissionId,
        },
      });

      // If it exists, delete it based on roleId and permissionId (no need for id)
      if (existingRolePermission) {
        await prisma.rolePermission.delete({
          where: {
            roleId_permissionId: {
              roleId,
              permissionId,
            },
          },
        });
      }

      // Create a new record
      const rolePermission = await prisma.rolePermission.create({
        data: {
          roleId,
          permissionId,
        },
        include: {
          role: true,
          permission: true,
        },
      });

      res.status(201).json(rolePermission);
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: 'Failed to assign permission to role' });
    }
  }
);

// Remove Permission from Role
router.delete('/roles/:roleId/:permissionId', async (req, res) => {
  try {
    const roleId = parseInt(req.params.roleId);
    const permissionId = parseInt(req.params.permissionId);

    await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove permission from role' });
  }
});

// Get all Role Permissions
router.get('/roles/permissions', async (req, res) => {
  try {
    const rolePermissions = await prisma.rolePermission.findMany({
      include: {
        role: true,
        permission: true
      }
    });

    res.status(200).json(rolePermissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve role permissions' });
  }
});

// Existing routes for assigning and removing permissions remain the same

module.exports = router;