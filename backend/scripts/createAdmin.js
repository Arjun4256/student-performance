const pool = require('../db');
const { hashPassword } = require('../utils/password.util');

async function createAdmin() {
    const username = 'admin';
    const email = 'admin@test.com';
    const password = 'admin123';

    try {
        const check = await pool.query(
            'SELECT * FROM admin_login WHERE email=$1',
            [email]
        );

        if (check.rows.length > 0) {
            console.log('Admin already exists');
            process.exit();
        }

        const hashedPassword = await hashPassword(password);

        await pool.query(
            'INSERT INTO admin_login (username, email, password) VALUES ($1,$2,$3)',
            [username, email, hashedPassword]
        );

        console.log('Admin created successfully');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createAdmin();
