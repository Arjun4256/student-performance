const pool = require('../db');

/* faculty profile retrieval */
exports.getFacultyProfile = async (req, res) => {
    try {

        const facultyLoginId = req.user.faculty_login_id;

        const result = await pool.query(
            `SELECT 
                fl.login_id,fl.faculty_code,fl.email,fl.is_active,fp.faculty_id,fp.name,fp.department,fp.designation,fp.experience,
                fp.created_at,
                fp.updated_at
             FROM faculty_login fl
             JOIN faculty_profile fp ON fl.login_id = fp.login_id
             WHERE fl.login_id = $1`,
            [facultyLoginId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty profile not found' });
        }

        res.json({
            message: 'Faculty profile retrieved successfully',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve faculty profile' });
    }
};

exports.getDepartmentStudents = async (req, res) => {
    try {
        // 🔒 Allow only faculty
        if (req.user.role !== "faculty") {
            return res.status(403).json({ error: "Access denied" });
        }

        const facultyLoginId = req.user.faculty_login_id;

        const result = await pool.query(
            `SELECT sa.*, sl.roll_no 
             FROM student_academic sa
             JOIN student_login sl ON sa.login_id = sl.login_id
             WHERE sa.department = (
                 SELECT department 
                 FROM faculty_profile 
                 WHERE login_id = $1
             )`,
            [facultyLoginId]
        );

        res.status(200).json({ data: result.rows });

    } catch (error) {
        console.error("Error fetching department students:", error);
        res.status(500).json({ error: "Server error" });
    }
};
/* update student marks */
exports.updateStudentMarks = async (req, res) => {
    const { login_id } = req.params;


    const facultyLoginId = req.user.faculty_login_id;


    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
    }

    const { name, department, year, semester, cgpa } = req.body;


    try {
        // Fetch existing record to preserve fields if not provided
        const existingRecord = await pool.query(
            `SELECT name, department, year, semester, cgpa FROM student_academic WHERE login_id = $1`,
            [login_id]
        );

        if (existingRecord.rows.length === 0) {
            return res.status(404).json({ error: 'Student academic record not found' });
        }

        const current = existingRecord.rows[0];
        const updateName = name || current.name;
        const updateDept = department || current.department;
        const updateYear = year || current.year;
        const updateSem = semester || current.semester;
        const updateCgpa = cgpa !== undefined ? cgpa : current.cgpa;

        const result = await pool.query(
            `UPDATE student_academic
             SET name = $1, 
                 department = $2, 
                 year = $3, 
                 semester = $4, 
                 cgpa = $5, 
                 updated_by_faculty = $6,
                 updated_at = NOW()
             WHERE login_id = $7
             RETURNING *`,
            [updateName, updateDept, updateYear, updateSem, updateCgpa, facultyLoginId, login_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Student academic record not found' });
        }

        res.json({
            message: 'Student marks updated successfully',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update student marks' });
    }
};
/* To view placement records */

exports.getAllStudentPlacements = async (req, res) => {
    try {

        const facultyLoginId = req.user.faculty_login_id;

        const result = await pool.query(
            `SELECT 
                p.placement_id,
                p.student_id,
                sl.roll_no,
                sl.email,
                sa.name,
                sa.department,
                p.company_name,
                p.package,
                p.status,
                p.created_at,
                p.updated_at
             FROM placement p
             JOIN student_login sl ON p.student_id = sl.login_id
             JOIN student_academic sa ON p.student_id = sa.login_id
             WHERE sa.department = (
                 SELECT department 
                 FROM faculty_profile 
                 WHERE login_id = $1
             )
             ORDER BY p.created_at DESC`,
            [facultyLoginId]
        );

        res.json({
            count: result.rows.length,
            data: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve student placements' });
    }
};
