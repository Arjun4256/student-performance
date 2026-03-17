const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'student placement_db',
    password: 'root',
    port: 5432
});

async function getStatuses() {
    try {
        const res = await pool.query('SELECT DISTINCT status FROM placement');
        process.stdout.write(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

getStatuses();
