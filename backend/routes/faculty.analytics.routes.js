const express = require('express');
const router = express.Router();
const facultyAnalyticsController = require('../controllers/faculty.analytics.controller');
const verifyToken = require('../middleware/verifyToken');

// Apply middleware to all routes
router.use(verifyToken);

/**
 * @swagger
 * /api/faculty/students:
 *   get:
 *     summary: Get list of students for faculty analytics
 *     tags: [Faculty Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics/students', facultyAnalyticsController.getStudentList);

/**
 * @swagger
 * /api/faculty/analytics/weak:
 *   get:
 *     summary: Get list of weak students based on performance
 *     tags: [Faculty Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weak students list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics/weak', facultyAnalyticsController.getWeakStudents);

/**
 * @swagger
 * /api/faculty/analytics/top:
 *   get:
 *     summary: Get list of top performing students
 *     tags: [Faculty Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top students list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics/top', facultyAnalyticsController.getTopStudents);

/**
 * @swagger
 * /api/faculty/analytics/stats:
 *   get:
 *     summary: Get summary statistics for faculty dashboard
 *     tags: [Faculty Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get('/analytics/stats', facultyAnalyticsController.getDashboardStats);

router.get('/analytics/department-students', facultyAnalyticsController.getFacultyPlacementRatio);

module.exports = router;
