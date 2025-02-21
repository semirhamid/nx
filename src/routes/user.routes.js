const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const userService = require('../services/user.service');

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
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
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
router.get('/:id', protect, async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Assign role to user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, manager]
 *     responses:
 *       200:
 *         description: Role assigned successfully
 */
router.patch('/:id/role', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await userService.assignRole(req.params.id, req.body.role);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}/team:
 *   post:
 *     tags: [Users]
 *     summary: Add user to a team
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *             properties:
 *               teamId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added to team successfully
 */
router.post('/:id/team', protect, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const user = await userService.addUserToTeam(req.params.id, req.body.teamId, req.user);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}/team:
 *   delete:
 *     tags: [Users]
 *     summary: Remove user from team
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
 *         description: User removed from team successfully
 */
router.delete('/:id/team', protect, authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const user = await userService.removeUserFromTeam(req.params.id, req.user);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}/permissions:
 *   post:
 *     tags: [Users]
 *     summary: Add specific permissions to user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissions
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Permissions added successfully
 */
router.post('/:id/permissions', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await userService.addPermissions(req.params.id, req.body.permissions);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}/permissions:
 *   delete:
 *     tags: [Users]
 *     summary: Remove specific permissions from user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissions
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Permissions removed successfully
 */
router.delete('/:id/permissions', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await userService.removePermissions(req.params.id, req.body.permissions);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 