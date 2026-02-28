const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const verifyToken = require('../middleware/verifyToken');

// Admin only (usually) routes
router.use(verifyToken);

/**
 * @swagger
 * /api/reports/eligible-list:
 *   get:
 *     summary: Generate CSV of eligible students for placements
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file generated successfully
 */
router.get('/eligible-list', reportController.generateEligibleListCSV);

/**
 * @swagger
 * /api/reports/performance-summary:
 *   get:
 *     summary: Generate CSV of overall student performance summary
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file generated successfully
 */
router.get('/performance-summary', reportController.generatePerformanceSummaryCSV);

module.exports = router;
