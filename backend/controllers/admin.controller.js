const { comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/jwt.util');
const pool = require('../db');

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM admin_login WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Admin not found' });
        }

        const admin = result.rows[0];

        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }


        const token = generateToken({
            admin_id: admin.login_id,
            role: 'admin'
        });

        res.json({ message: 'Login successful', token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

async function logout(req, res) {
    try {
        const adminInfo = req.user;
        res.json({
            message: 'Logout successful',
            admin: {
                admin_id: adminInfo.admin_id
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Logout failed' });
    }
}

module.exports = { login, logout };
