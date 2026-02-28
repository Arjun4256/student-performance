const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.crud.controller');
const verifyToken = require('../middleware/verifyToken');


router.use(verifyToken);



/**
 * @swagger
 * /student/profile:
 *   get:
 *     summary: Get current student's profile
 *     tags: [Student CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', studentController.getMyProfile);

/**
 * @swagger
 * /student/placements:
 *   get:
 *     summary: Get current student's placement records
 *     tags: [Student CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Placement records retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/placements', studentController.getMyPlacements);

module.exports = router;
