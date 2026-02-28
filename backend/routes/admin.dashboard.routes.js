const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/admin.dashboard.controller');
const verifyToken = require('../middleware/verifyToken');

// Admin only routes
router.use(verifyToken);

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get overview statistics for the admin dashboard
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview stats retrieved successfully
 */
router.get('/stats', adminDashboardController.getOverviewStats);

/**
 * @swagger
 * /api/admin/dashboard/faculty/status/{login_id}:
 *   put:
 *     summary: Update faculty member status
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: login_id
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Faculty status updated successfully
 */
router.put('/faculty/status/:login_id', adminDashboardController.updateFacultyStatus);

module.exports = router;
