const pool = require('../db');
const { comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/jwt.util');

exports.loginFaculty = async (req, res) => {
    const { faculty_code, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT 
                fl.login_id, 
                fl.password, 
                fl.is_active, 
                fp.name
             FROM faculty_login fl
             JOIN faculty_profile fp ON fl.login_id = fp.login_id
             WHERE fl.faculty_code = $1`,
            [faculty_code]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Faculty not found' });
        }

        const faculty = result.rows[0];

        if (!faculty.is_active) {
            return res.status(403).json({ error: 'Account deactivated' });
        }

        const isMatch = await comparePassword(password, faculty.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken({
            faculty_login_id: faculty.login_id,
            faculty_code: faculty_code,
            role: 'faculty'
        });

        res.json({
            message: 'Login successful',
            token,
            faculty: {
                name: faculty.name,
                faculty_code
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
};

/* FACULTY LOGOUT */
exports.logoutFaculty = async (req, res) => {
    try {
        const facultyInfo = req.user;
        res.json({
            message: 'Logout successful',
            faculty: {
                faculty_code: facultyInfo.faculty_code
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Logout failed' });
    }
};
