const pool = require('../db');
const fs = require('fs');

async function inspectSchema() {
    let output = '';
    const log = (msg) => { output += msg + '\n'; };

    try {
        log('--- DB INSPECTION START ---');

        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        log('TABLES FOUND: ' + tablesResult.rows.map(r => r.table_name).join(', '));

        const tablesToInspect = ['placement', 'placements', 'student_login', 'student_academic'];

        for (const tableName of tablesToInspect) {
            const cols = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [tableName]);

            if (cols.rows.length > 0) {
                log(`\nCOLUMNS IN ${tableName.toUpperCase()}:`);
                cols.rows.forEach(c => {
                    log(` - ${c.column_name} (${c.data_type})`);
                });
            } else {
                log(`\nTABLE ${tableName.toUpperCase()} NOT FOUND OR HAS NO COLUMNS`);
            }
        }

        log('\n--- DB INSPECTION END ---');
        fs.writeFileSync('schema_output.txt', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('schema_output.txt', 'ERROR: ' + err.message);
        process.exit(1);
    }
}

inspectSchema();
