const pool = require('../db');

/* Overview Stats */
exports.getOverviewStats = async (req, res) => {
    try {
        // Total students
        const totalStudentsResult = await pool.query('SELECT COUNT(*) FROM student_login WHERE is_active = true');

        // Eligible for placement (CGPA >= 7.0 as default threshold)
        const eligibleStudentsResult = await pool.query('SELECT COUNT(*) FROM student_academic WHERE cgpa >= 7.0');

        // Total placements
        const totalPlacementsResult = await pool.query('SELECT COUNT(*) FROM placement WHERE status = $1', ['Selected']);

        const totalStudents = parseInt(totalStudentsResult.rows[0].count);
        const eligibleStudents = parseInt(eligibleStudentsResult.rows[0].count);
        const placedStudents = parseInt(totalPlacementsResult.rows[0].count);

        const placementPercentage = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0;

        res.json({
            total_students: totalStudents,
            eligible_students: eligibleStudents,
            placed_students: placedStudents,
            placement_percentage: placementPercentage
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch overview stats' });
    }
};

/* Deactivate/Activate Faculty */
exports.updateFacultyStatus = async (req, res) => {
    const { login_id } = req.params;
    const { is_active } = req.body;

    try {
        const result = await pool.query(
            'UPDATE faculty_login SET is_active = $1 WHERE login_id = $2 RETURNING login_id, is_active',
            [is_active, login_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        res.json({
            message: `Faculty status updated to ${is_active ? 'active' : 'inactive'}`,
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update faculty status' });
    }
};
