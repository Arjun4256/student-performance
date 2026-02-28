const express = require('express');
const router = express.Router();
const facultyAuthController = require('../../controllers/faculty.controller');
const verifyToken = require('../../middleware/verifyToken');

/**
 * @swagger
 * /api/faculty/login:
 *   post:
 *     summary: Faculty login
 *     tags: [Faculty Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               faculty_code:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', facultyAuthController.loginFaculty);

/**
 * @swagger
 * /api/faculty/logout:
 *   post:
 *     summary: Faculty logout
 *     tags: [Faculty Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', verifyToken, facultyAuthController.logoutFaculty);

module.exports = router;
