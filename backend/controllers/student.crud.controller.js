const pool = require('../db'); 

/*get student self profile*/
exports.getMyProfile = async (req, res) => {
    try {
        const loginId = req.user.login_id; 

        const result = await pool.query(
            `SELECT *
             FROM student_self_view
             WHERE login_id = $1`,
            [loginId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        res.status(200).json({
            success: true,
            profile: result.rows[0]
        });

    } catch (error) {
        console.error('Student profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};





/* ===========================
   STUDENT PLACEMENTS
=========================== */
exports.getMyPlacements = async (req, res) => {
    try {
        const loginId = req.user.login_id;

        const result = await pool.query(
            `SELECT 
                placement_id,
                company_name,
                package,
                status,
                created_at
             FROM placement
             WHERE student_id = $1
             ORDER BY created_at DESC`,
            [loginId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            placements: result.rows
        });

    } catch (error) {
        console.error('Placement Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

