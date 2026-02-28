const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.crud.controller');
const verifyToken = require('../middleware/verifyToken');

// Debug logging for all routes in this file
router.use((req, res, next) => {
    console.log(`--- ADMIN CRUD ROUTE: ${req.method} ${req.url}`);
    next();
});

/**
 * @swagger
 * /admin/students:
 *   get:
 *     summary: Get all students
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
 */
router.get('/students', verifyToken, adminController.getAllStudents);

/**
 * @swagger
 * /admin/students/{login_id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: login_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student data retrieved successfully
 */
router.get('/students/:login_id', verifyToken, (req, res, next) => { console.log('--- ROUTE MATCHED: /students/:login_id with ID:', req.params.login_id); next(); }, adminController.getStudentById);

/**
 * @swagger
 * /admin/students/verify/{login_id}:
 *   put:
 *     summary: Verify student account
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: login_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student verified successfully
 */
router.put('/students/verify/:login_id', verifyToken, adminController.verifyStudent);

/**
 * @swagger
 * /admin/students/status/{login_id}:
 *   put:
 *     summary: Update student account status
 *     tags: [Admin CRUD]
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
 *         description: Status updated successfully
 */
router.put('/students/status/:login_id', verifyToken, adminController.updateStudentStatus);

/**
 * @swagger
 * /admin/students/academic/{login_id}:
 *   post:
 *     summary: Create student academic record
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: login_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Academic record created successfully
 */
router.post('/students/academic/:login_id', verifyToken, adminController.createStudentAcademic);

/**
 * @swagger
 * /admin/students/academic/{login_id}:
 *   put:
 *     summary: Update student academic record
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: login_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Academic record updated successfully
 */
router.put('/students/academic/:login_id', verifyToken, adminController.updateStudentAcademic);

/**
 * @swagger
 * /admin/students/{login_id}:
 *   delete:
 *     summary: Delete student account
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: login_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted successfully
 */
router.delete('/students/:login_id', verifyToken, adminController.deleteStudent);

/**
 * @swagger
 * /admin/faculty:
 *   get:
 *     summary: Get all faculty members
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of faculty retrieved successfully
 */
router.get('/faculty', verifyToken, adminController.getAllFaculty);

/**
 * @swagger
 * /admin/faculty:
 *   post:
 *     summary: Create faculty account
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Faculty created successfully
 */
router.post('/faculty', verifyToken, adminController.createFaculty);

/**
 * @swagger
 * /admin/faculty/{login_id}:
 *   delete:
 *     summary: Delete faculty account
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: login_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Faculty deleted successfully
 */
router.delete('/faculty/:login_id', verifyToken, adminController.deleteFaculty);

/**
 * @swagger
 * /admin/placement:
 *   post:
 *     summary: Create placement drive
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Placement drive created successfully
 */
router.post('/placement', verifyToken, adminController.createPlacement);

/**
 * @swagger
 * /admin/placement:
 *   get:
 *     summary: Get all placement drives
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of placement drives retrieved successfully
 */
router.get('/placement/placed', verifyToken, (req, res, next) => { console.log('--- ROUTE MATCHED: /admin/placement/placed'); next(); }, adminController.getPlacedStudents);
router.get('/placement/unplaced', verifyToken, (req, res, next) => { console.log('--- ROUTE MATCHED: /admin/placement/unplaced'); next(); }, adminController.getUnplacedStudents);

/**
 * @swagger
 * /admin/placement:
 *   get:
 *     summary: Get all placement drives
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of placement drives retrieved successfully
 */
router.get('/placement', verifyToken, adminController.getAllPlacements);

/**
 * @swagger
 * /admin/placement/{placement_id}:
 *   put:
 *     summary: Update placement drive
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placement_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Placement drive updated successfully
 */
router.put('/placement/:placement_id', verifyToken, adminController.updatePlacement);

/**
 * @swagger
 * /admin/placement/{placement_id}:
 *   delete:
 *     summary: Delete placement drive
 *     tags: [Admin CRUD]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placement_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Placement drive deleted successfully
 */
router.delete('/placement/:placement_id', verifyToken, adminController.deletePlacement);

module.exports = router;
