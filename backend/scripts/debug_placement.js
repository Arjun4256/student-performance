const pool = require('../db');

async function inspect() {
    try {
        console.log('--- FULL DATA INSPECTION ---');

        const students = await pool.query(`
            SELECT sl.login_id, sl.roll_no, sa.name, sa.department
            FROM student_login sl
            LEFT JOIN student_academic sa ON sl.login_id = sa.login_id
        `);
        console.log('--- Students ---');
        console.table(students.rows);

        const placements = await pool.query(`
            SELECT p.*, sl.roll_no
            FROM placement p
            JOIN student_login sl ON p.student_id = sl.login_id
        `);
        console.log('--- Placements ---');
        console.table(placements.rows);

        const placed = await pool.query(`
            SELECT sl.login_id, sl.roll_no, sa.name
            FROM student_login sl
            LEFT JOIN student_academic sa ON sl.login_id = sa.login_id
            WHERE EXISTS (
                SELECT 1 FROM placement p
                WHERE p.student_id = sl.login_id AND LOWER(p.status) = 'selected'
            )
        `);
        console.log('--- Placed Students (Logic) ---');
        console.table(placed.rows);

        const unplaced = await pool.query(`
            SELECT sl.login_id, sl.roll_no, sa.name
            FROM student_login sl
            LEFT JOIN student_academic sa ON sl.login_id = sa.login_id
            WHERE NOT EXISTS (
                SELECT 1 FROM placement p
                WHERE p.student_id = sl.login_id AND LOWER(p.status) = 'selected'
            )
        `);
        console.log('--- Unplaced Students (Logic) ---');
        console.table(unplaced.rows);

    } catch (err) {
        console.error('Inspection failed:', err);
    } finally {
        await pool.end();
    }
}

inspect();
