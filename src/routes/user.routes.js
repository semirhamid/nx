const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', protect, authorize('admin'), (req, res) => {
  // TODO: Implement get all users
  res.status(200).json({ message: 'Get all users endpoint' });
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get('/:id', protect, (req, res) => {
  // TODO: Implement get user by id
  res.status(200).json({ message: 'Get user by id endpoint' });
});

module.exports = router; 