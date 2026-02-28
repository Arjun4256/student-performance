const pool = require('../db');
const fs = require('fs');
const path = require('path');

async function initDb() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'create_performance_tables.sql'), 'utf8');
        await pool.query(sql);
        console.log('Database tables initialized successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database tables:', err);
        process.exit(1);
    }
}

initDb();
