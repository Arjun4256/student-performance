const pool = require('../db');
const fs = require('fs');

async function checkStatus() {
    try {
        const result = await pool.query('SELECT DISTINCT status FROM placement');
        const statuses = result.rows.map(r => r.status);
        fs.writeFileSync('status_values.txt', 'Unique statuses: ' + JSON.stringify(statuses));
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('status_values.txt', 'Error: ' + err.message);
        process.exit(1);
    }
}

checkStatus();
