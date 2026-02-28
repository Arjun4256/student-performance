const express = require('express');
const router = express.Router();
const studentAuthController = require('../../controllers/student.controller');



const verifyToken = require('../../middleware/verifyToken');
/**
 * @swagger
 * /api/student/signup:
 *   post:
 *     summary: Student signup
 *     tags: [Student Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roll_no:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', studentAuthController.signup);

/**
 * @swagger
 * /api/student/login:
 *   post:
 *     summary: Student login
 *     tags: [Student Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roll_no:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', studentAuthController.login);

/**
 * @swagger
 * /api/student/logout:
 *   post:
 *     summary: Student logout
 *     tags: [Student Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', verifyToken, studentAuthController.logout);




module.exports = router;
