const pool = require('../db');
const bcrypt = require('bcryptjs');



/* student CRUD */
exports.getAllStudents = async (req, res) => {
    try {
        const { search, department, year, semester } = req.query;
        let query = `
            SELECT sl.login_id, sl.roll_no, sl.email, sl.is_verified, sl.is_active, sa.name, sa.department, sa.year, sa.semester, sa.cgpa
            FROM student_login sl
            LEFT JOIN student_academic sa ON sl.login_id = sa.login_id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            params.push(`%${search}%`);
            query += ` AND (sl.roll_no ILIKE $${params.length} OR sa.name ILIKE $${params.length})`;
        }
        if (department) {
            params.push(department);
            query += ` AND sa.department = $${params.length}`;
        }
        if (year) {
            params.push(year);
            query += ` AND sa.year = $${params.length}`;
        }
        if (semester) {
            params.push(semester);
            query += ` AND sa.semester = $${params.length}`;
        }

        query += ` ORDER BY sl.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    const { login_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT sl.login_id, sl.roll_no, sl.email, sl.is_verified, sl.is_active, sa.name, sa.department, sa.year, sa.semester, sa.cgpa
             FROM student_login sl
             LEFT JOIN student_academic sa ON sl.login_id = sa.login_id
             WHERE sl.login_id = $1`,
            [login_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.verifyStudent = async (req, res) => {
    const { login_id } = req.params;
    try {
        await pool.query(
            `UPDATE student_login SET is_verified = true WHERE login_id = $1`,
            [login_id]
        );
        res.json({ message: 'Student verified' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStudentStatus = async (req, res) => {
    const { login_id } = req.params;
    const { is_active } = req.body;
    try {
        await pool.query(
            `UPDATE student_login SET is_active = $1 WHERE login_id = $2`,
            [is_active, login_id]
        );
        res.json({ message: 'Student status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createStudentAcademic = async (req, res) => {
    const { login_id } = req.params;
    const { name, department, year, semester, cgpa } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO student_academic
             (login_id, name, department, year, semester, cgpa, created_by_admin)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING *`,
            [
                login_id,
                name,
                department,
                year,
                semester,
                cgpa,
                req.user.login_id
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStudentAcademic = async (req, res) => {
    const { login_id } = req.params;


    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }

    const { name, department, year, semester, cgpa } = req.body;


    if (!name || !department || !year || !semester) {
        return res.status(400).json({
            error: "name, department, year, and semester are required"
        });
    }

    try {
        const result = await pool.query(
            `UPDATE student_academic
             SET name=$1, department=$2, year=$3, semester=$4, cgpa=$5, updated_at=NOW()
             WHERE login_id=$6
             RETURNING *`,
            [name, department, year, semester, cgpa || null, login_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Student academic record not found" });
        }

        res.json({
            message: "Student academic updated successfully",
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.deleteStudent = async (req, res) => {
    const { login_id } = req.params;
    try {
        await pool.query(
            `DELETE FROM student_login WHERE login_id=$1`,
            [login_id]
        );
        res.json({ message: 'Student deleted permanently' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* faculty CRUD */
exports.getAllFaculty = async (req, res) => {
    try {
        const { search, department } = req.query;
        let query = `
            SELECT fl.login_id, fl.faculty_code, fl.email, fl.is_active,
             fp.name, fp.department, fp.designation, fp.experience
             FROM faculty_login fl
             JOIN faculty_profile fp ON fl.login_id = fp.login_id
             WHERE 1=1
        `;
        const params = [];

        if (search) {
            params.push(`%${search}%`);
            query += ` AND (fl.faculty_code ILIKE $${params.length} OR fp.name ILIKE $${params.length})`;
        }
        if (department) {
            params.push(department);
            query += ` AND fp.department = $${params.length}`;
        }

        query += ` ORDER BY fp.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createFaculty = async (req, res) => {
    const { faculty_code, email, password, name, department, designation, experience } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const loginResult = await pool.query(
            `INSERT INTO faculty_login (faculty_code, email, password)
             VALUES ($1,$2,$3) RETURNING login_id`,
            [faculty_code, email, hashed]
        );
        const login_id = loginResult.rows[0].login_id;
        await pool.query(
            `INSERT INTO faculty_profile (login_id, name, department, designation, experience, created_by_admin)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            [login_id, name, department, designation, experience, req.user.login_id]
        );
        res.status(201).json({ message: 'Faculty created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteFaculty = async (req, res) => {
    const { login_id } = req.params;
    try {
        await pool.query(
            `DELETE FROM faculty_login WHERE login_id=$1`,
            [login_id]
        );
        res.json({ message: 'Faculty deleted permanently' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* Placement CRUD */
exports.createPlacement = async (req, res) => {
    const { student_id, company_name, package, status } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO placement (student_id, company_name, package, status, created_by_admin)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [student_id, company_name, package, status || 'Applied', req.user.login_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllPlacements = async (req, res) => {
    try {
        const { department } = req.query;
        let query = `
            SELECT p.*, sl.roll_no, sl.email, sa.department
             FROM placement p
             JOIN student_login sl ON p.student_id = sl.login_id
             LEFT JOIN student_academic sa ON sl.login_id = sa.login_id
             WHERE 1=1
        `;
        const params = [];
        if (department) {
            params.push(department);
            query += ` AND sa.department = $${params.length}`;
        }
        query += ` ORDER BY p.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePlacement = async (req, res) => {
    try {
        console.log("HEADERS:", req.headers);
        console.log("BODY:", req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "Request body is missing. Send JSON with Content-Type application/json"
            });
        }

        const { company_name, package: pkg, status } = req.body;
        const { placement_id } = req.params;

        const result = await pool.query(
            `
      UPDATE placement
      SET
        company_name = $1,
        status = $2,
        package = $3
      WHERE placement_id = $4
      RETURNING *
      `,
            [company_name, status, pkg, placement_id]
        );

        res.json({
            message: "Placement updated successfully",
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};



exports.deletePlacement = async (req, res) => {
    const { placement_id } = req.params;
    try {
        await pool.query(
            `DELETE FROM placement WHERE placement_id=$1`,
            [placement_id]
        );
        res.json({ message: 'Placement deleted permanently' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPlacedStudents = async (req, res) => {
    try {
        const { department } = req.query;
        let query = `
      SELECT sl.login_id, sl.roll_no, sl.email,
             sa.name, sa.department, sa.year, sa.semester, sa.cgpa
      FROM student_login sl
      LEFT JOIN student_academic sa ON sl.login_id = sa.login_id
      WHERE EXISTS (
        SELECT 1 FROM placement p
        WHERE p.student_id = sl.login_id AND TRIM(LOWER(p.status)) IN ('selected', 'placed')
      )
    `;
        const params = [];
        if (department) {
            params.push(department);
            query += ` AND sa.department = $${params.length}`;
        }
        query += ` ORDER BY sa.cgpa DESC NULLS LAST`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Error in getPlacedStudents:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getUnplacedStudents = async (req, res) => {
    try {
        const { department } = req.query;
        let query = `
      SELECT sl.login_id, sl.roll_no, sl.email,
             sa.name, sa.department, sa.year, sa.semester, sa.cgpa
      FROM student_login sl
      LEFT JOIN student_academic sa ON sl.login_id = sa.login_id
      WHERE NOT EXISTS (
        SELECT 1 FROM placement p
        WHERE p.student_id = sl.login_id 
        AND TRIM(LOWER(p.status)) IN ('selected', 'placed')
      )
    `;
        const params = [];
        if (department) {
            params.push(department);
            query += ` AND sa.department = $${params.length}`;
        }
        query += ` ORDER BY sa.cgpa DESC NULLS LAST`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Error in getUnplacedStudents:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
