const { authenticateToken } = require('./verify');

const multer = require('multer');
const path = require('path');

const express = require('express');

const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();



// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `profile-${req.params.userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Configure multer file filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Initialize multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

// Profile image upload route
router.patch('/update-profile-image',
    authenticateToken,
    upload.single('profileImage'),
    async (req, res) => {
        try {
            const userId = req.user.userId;
    
            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    message: 'No image uploaded'
                });
            }

            // Construct file path
            const imagePath = `/uploads/profile-images/${req.file.filename}`;

            // Update user's profile image in database
            const updatedUser = await prisma.user.update({
                where: {
                    id: parseInt(userId)
                },
                data: {
                    img: imagePath
                },
                select: {
                    id: true,
                    username: true,
                    img: true
                }
            });

            res.status(200).json({
                message: 'Profile image updated successfully',
                user: updatedUser
            });

        } catch (error) {
            console.error('Update profile image error:', error);

            // Remove uploaded file if database update fails
            if (req.file) {
                const fs = require('fs');
                fs.unlinkSync(req.file.path);
            }


            if (error.code === 'P2025') {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.status(500).json({
                message: 'Internal server error'
            });
        }
    }
);

module.exports = router;