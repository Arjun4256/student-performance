const pool = require('../db');
const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, '../temp');

/* Helper to convert JSON to CSV */
const jsonToCsv = (json, fields) => {
    const csvRows = [];
    csvRows.push(fields.join(','));
    for (const row of json) {
        const values = fields.map(field => {
            const val = row[field];
            return `"${val}"`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
};

/* Export Eligible Students to CSV */
exports.generateEligibleListCSV = async (req, res) => {
    try {
        const { cutoff = 7.0 } = req.query;
        const result = await pool.query(`
            SELECT sa.student_id, sl.roll_no, sa.name, sa.department, sa.cgpa, sl.email
            FROM student_academic sa
            JOIN student_login sl ON sa.login_id = sl.login_id
            WHERE sa.cgpa >= $1
        `, [cutoff]);

        const fields = ['roll_no', 'name', 'department', 'cgpa', 'email'];
        const csvContent = jsonToCsv(result.rows, fields);
        const fileName = `eligible_students_${Date.now()}.csv`;
        const filePath = path.join(tempDir, fileName);

        fs.writeFileSync(filePath, csvContent);

        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Download error:', err);
            }

        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate eligible list report' });
    }
};

/* Export Performance Summary to CSV */
exports.generatePerformanceSummaryCSV = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT sa.department, 
                   COUNT(*) as total_students, 
                   ROUND(AVG(cgpa), 2) as avg_cgpa,
                   MAX(cgpa) as max_cgpa
            FROM student_academic sa
            GROUP BY sa.department
        `);

        const fields = ['department', 'total_students', 'avg_cgpa', 'max_cgpa'];
        const csvContent = jsonToCsv(result.rows, fields);
        const fileName = `performance_summary_${Date.now()}.csv`;
        const filePath = path.join(tempDir, fileName);

        fs.writeFileSync(filePath, csvContent);

        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Download error:', err);
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate performance summary report' });
    }
};
