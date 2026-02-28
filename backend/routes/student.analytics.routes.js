const express = require('express');
const router = express.Router();
const studentAnalyticsController = require('../controllers/student.analytics.controller');
const verifyToken = require('../middleware/verifyToken');

// Apply middleware to all routes
router.use(verifyToken);

/**
 * @swagger
 * /api/student/performance:
 *   get:
 *     summary: Get student performance indicators
 *     tags: [Student Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance indicators retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/performance', studentAnalyticsController.getPerformanceIndicators);

module.exports = router;
