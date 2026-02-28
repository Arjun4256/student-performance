const pool = require('../db');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/jwt.util');

/*  STUDENT SIGNUP  */
exports.signup = async (req, res) => {
    const { roll_no, email, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        const result = await pool.query(
            `INSERT INTO student_login (roll_no, email, password)
             VALUES ($1, $2, $3)
             RETURNING login_id, roll_no, email`,
            [roll_no, email, hashedPassword]
        );

        res.status(201).json({
            message: 'Signup successful. Wait for verification.',
            student: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Student already exists or invalid data' });
    }
};

/* STUDENT LOGIN  */
exports.login = async (req, res) => {
    const { roll_no, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM student_login
             WHERE roll_no=$1 AND is_active=true`,
            [roll_no]
        );

        if (result.rows.length === 0)
            return res.status(401).json({ error: 'Invalid credentials' });

        const student = result.rows[0];

        const valid = await comparePassword(password, student.password);
        if (!valid)
            return res.status(401).json({ error: 'Invalid credentials' });

        const token = generateToken({
    login_id: student.login_id,   
    roll_no: student.roll_no,
    email: student.email,
    role: 'student'
});


        res.json({ message: 'Login successful', token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
};


/* STUDENT LOGOUT */
exports.logout = async (req, res) => {
    try {
        const studentInfo = req.user; 
        res.json({
            message: 'Logout successful',
            student: {
                roll_no: studentInfo.roll_no,
                email: studentInfo.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Logout failed' });
    }
};