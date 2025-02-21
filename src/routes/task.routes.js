const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', protect, (req, res) => {
  // TODO: Implement get all tasks
  res.status(200).json({ message: 'Get all tasks endpoint' });
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', protect, (req, res) => {
  // TODO: Implement create task
  res.status(201).json({ message: 'Create task endpoint' });
});

module.exports = router; 