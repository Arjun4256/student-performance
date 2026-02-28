const pool = require('../db');

/* Placement count by company*/

exports.placementsByCompany = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                company_name,
                COUNT(*) AS total_students
            FROM placement
            GROUP BY company_name
            ORDER BY total_students DESC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch placement by company' });
    }
};

/*Placement status statistics*/

exports.placementStatusStats = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                status,
                COUNT(*) AS count
            FROM placement
            GROUP BY status
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch placement status stats' });
    }
};

/* Average package (Selected only)*/

exports.averagePackage = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                ROUND(AVG(package), 2) AS average_package
            FROM placement
            WHERE status = 'Selected'
        `);

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch average package' });
    }
};

/* Department-wise average CGPA*/

exports.departmentWiseCGPA = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                department,
                ROUND(AVG(cgpa), 2) AS avg_cgpa,
                COUNT(*) AS total_students,
                MAX(cgpa) AS max_cgpa,
                MIN(cgpa) AS min_cgpa
            FROM student_academic
            GROUP BY department
            ORDER BY avg_cgpa DESC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch department-wise CGPA' });
    }
};

/* CGPA distribution (Histogram)*/

exports.cgpaDistribution = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                CASE
                    WHEN cgpa < 6 THEN '< 6'
                    WHEN cgpa BETWEEN 6 AND 6.99 THEN '6 - 6.99'
                    WHEN cgpa BETWEEN 7 AND 7.99 THEN '7 - 7.99'
                    WHEN cgpa BETWEEN 8 AND 8.99 THEN '8 - 8.99'
                    ELSE '9+'
                END AS cgpa_range,
                COUNT(*) AS student_count
            FROM student_academic
            GROUP BY cgpa_range
            ORDER BY cgpa_range
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch CGPA distribution' });
    }
};

/* Top companies by average package*/

exports.topCompaniesByPackage = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                company_name,
                ROUND(AVG(package), 2) AS avg_package
            FROM placement
            WHERE status = 'Selected'
            GROUP BY company_name
            ORDER BY avg_package DESC
            LIMIT 5
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch top companies by package' });
    }
};

/* Placement Eligibility Analytics */
exports.getPlacementEligibility = async (req, res) => {
    try {
        const { cutoff = 7.0 } = req.query;
        const result = await pool.query(`
            SELECT 
                CASE 
                    WHEN cgpa >= $1 THEN 'Eligible'
                    ELSE 'Not Eligible'
                END AS eligibility,
                COUNT(*) AS count
            FROM student_academic
            GROUP BY eligibility
        `, [cutoff]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch placement eligibility' });
    }
};

/* Placement Readiness Index (Mock logic based on CGPA and status) */
exports.getPlacementReadiness = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                department,
                ROUND(AVG(CASE 
                    WHEN cgpa >= 8.5 THEN 100
                    WHEN cgpa >= 7.5 THEN 80
                    WHEN cgpa >= 6.5 THEN 60
                    ELSE 40
                END), 2) AS readiness_score
            FROM student_academic
            GROUP BY department
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch readiness index' });
    }
};

/* CGPA Cutoff Analysis */
exports.getCutoffAnalysis = async (req, res) => {
    try {
        const result = await pool.query(`
            WITH thresholds AS (
                SELECT unnest(ARRAY[6.0, 6.5, 7.0, 7.5, 8.0]) AS threshold
            )
            SELECT 
                t.threshold,
                COUNT(sa.student_id) AS student_count
            FROM thresholds t
            LEFT JOIN student_academic sa ON sa.cgpa >= t.threshold
            GROUP BY t.threshold
            ORDER BY t.threshold
        `);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch cutoff analysis' });
    }
};
