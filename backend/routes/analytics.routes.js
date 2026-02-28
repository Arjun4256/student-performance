const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analytics.controller');
const verifyToken = require('../middleware/verifyToken');


/* Analytics Routes (Admin only)*/



/**
 * @swagger
 * /analytics/placements/company:
 *   get:
 *     summary: Get placement statistics by company
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/placements/company', verifyToken, analyticsController.placementsByCompany);

/**
 * @swagger
 * /analytics/placements/status:
 *   get:
 *     summary: Get overall placement status statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/placements/status', verifyToken, analyticsController.placementStatusStats);

/**
 * @swagger
 * /analytics/placements/average-package:
 *   get:
 *     summary: Get average package statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/placements/average-package', verifyToken, analyticsController.averagePackage);

/**
 * @swagger
 * /analytics/placements/top-companies:
 *   get:
 *     summary: Get top companies by package
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/placements/top-companies', verifyToken, analyticsController.topCompaniesByPackage);

/**
 * @swagger
 * /analytics/academics/department-cgpa:
 *   get:
 *     summary: Get department-wise CGPA statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/academics/department-cgpa', verifyToken, analyticsController.departmentWiseCGPA);

/**
 * @swagger
 * /analytics/academics/cgpa-distribution:
 *   get:
 *     summary: Get CGPA distribution statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/academics/cgpa-distribution', verifyToken, analyticsController.cgpaDistribution);

/**
 * @swagger
 * /analytics/analytics/eligibility:
 *   get:
 *     summary: Get placement eligibility analysis
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analysis retrieved successfully
 */
router.get('/analytics/eligibility', verifyToken, analyticsController.getPlacementEligibility);

/**
 * @swagger
 * /analytics/analytics/cutoff:
 *   get:
 *     summary: Get cutoff analysis based on criteria
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analysis retrieved successfully
 */
router.get('/analytics/cutoff', verifyToken, analyticsController.getCutoffAnalysis);

/**
 * @swagger
 * /analytics/analytics/readiness:
 *   get:
 *     summary: Get placement readiness score analysis
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analysis retrieved successfully
 */
router.get('/analytics/readiness', verifyToken, analyticsController.getPlacementReadiness);

module.exports = router;
