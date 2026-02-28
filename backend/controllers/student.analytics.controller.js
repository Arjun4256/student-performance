const pool = require('../db');

/* Performance Indicators (Current CGPA, Placement Status) */
exports.getPerformanceIndicators = async (req, res) => {
    try {
        const loginId = req.user.login_id;

        const academicResult = await pool.query(
            `SELECT cgpa, semester, year FROM student_academic WHERE login_id = $1`,
            [loginId]
        );

        const trendResult = await pool.query(
            `SELECT semester, sgpa, cgpa FROM student_semester_performance 
             WHERE login_id = $1 ORDER BY semester ASC`,
            [loginId]
        );

        const placementResult = await pool.query(
            `SELECT status, company_name FROM placement WHERE student_id = $1 ORDER BY created_at DESC LIMIT 1`,
            [loginId]
        );

        res.json({
            academic: academicResult.rows[0] || null,
            trend: trendResult.rows || [],
            placement: placementResult.rows[0] || { status: 'Not Applied', company_name: null }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch performance indicators' });
    }
};
