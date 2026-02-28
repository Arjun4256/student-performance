const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/faculty.crud.controller');
const verifyToken = require('../middleware/verifyToken');



/**
 * @swagger
 * /faculty/profile:
 *   get:
 *     summary: Get current faculty member's profile
 *     tags: [Faculty CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', verifyToken, facultyController.getFacultyProfile);

/**
 * @swagger
 * /faculty/students:
 *   get:
 *     summary: Get all students' academic records
 *     tags: [Faculty CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student academic records retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/students', verifyToken, facultyController.getDepartmentStudents);

/**
 * @swagger
 * /faculty/students/{login_id}:
 *   put:
 *     summary: Update student marks
 *     tags: [Faculty CRUD]
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
 *               marks:
 *                 type: number
 *     responses:
 *       200:
 *         description: Marks updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/students/:login_id', verifyToken, facultyController.updateStudentMarks);

/**
 * @swagger
 * /faculty/students/placement:
 *   get:
 *     summary: Get all students' placement records
 *     tags: [Faculty CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Placement records retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/students/placement', verifyToken, facultyController.getAllStudentPlacements);

module.exports = router;
