const pool = require('../db');

async function inspect() {
    try {
        console.log('--- Inspecting Students and Placements ---');

        const students = await pool.query('SELECT login_id, roll_no FROM student_login');
        console.log('Students:', JSON.stringify(students.rows, null, 2));

        const placements = await pool.query('SELECT * FROM placement');
        console.log('Placements:', JSON.stringify(placements.rows, null, 2));

        const unplaced = await pool.query(`
            SELECT sl.login_id, sl.roll_no 
            FROM student_login sl
            WHERE NOT EXISTS (
                SELECT 1 FROM placement p
                WHERE p.student_id = sl.login_id 
                AND TRIM(LOWER(p.status)) = 'selected'
            )
        `);
        console.log('Unplaced Students (Current Logic):', JSON.stringify(unplaced.rows, null, 2));

    } catch (err) {
        console.error('Inspection failed:', err.message);
    } finally {
        await pool.end();
    }
}

inspect();
