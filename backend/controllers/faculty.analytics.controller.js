const pool = require('../db');

/* Get Student List with Filters */
exports.getStudentList = async (req, res) => {
  try {
    if (req.user.role !== "faculty")
      return res.status(403).json({ error: "Access denied" });

    const { semester, min_cgpa, max_cgpa } = req.query;

    let query = `
      SELECT sl.login_id, sl.roll_no, sl.email,
             sa.name, sa.department, sa.year, sa.semester, sa.cgpa
      FROM student_login sl
      JOIN student_academic sa ON sl.login_id = sa.login_id
      WHERE sl.is_active = true
        AND sa.department = (
          SELECT fp.department
          FROM faculty_profile fp
          JOIN faculty_login fl ON fp.login_id = fl.login_id
          WHERE fl.faculty_code = $1
        )`;

    const params = [req.user.faculty_code];

    if (semester) query += ` AND sa.semester = $${params.push(semester)}`;
    if (min_cgpa) query += ` AND sa.cgpa >= $${params.push(min_cgpa)}`;
    if (max_cgpa) query += ` AND sa.cgpa <= $${params.push(max_cgpa)}`;

    query += ` ORDER BY sa.cgpa DESC`;

    const result = await pool.query(query, params);
    res.json({ count: result.rowCount, students: result.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch student list" });
  }
};

/* Get Weak Students (CGPA < 6.0) */
exports.getWeakStudents = async (req, res) => {
  try {
    if (req.user.role !== "faculty")
      return res.status(403).json({ error: "Access denied" });

    const query = `
      SELECT sl.login_id, sl.roll_no, sa.name, sa.department, sa.cgpa
      FROM student_login sl
      JOIN student_academic sa ON sl.login_id = sa.login_id
      WHERE sl.is_active = true
        AND sa.cgpa < 6.0
        AND sa.department = (
          SELECT fp.department
          FROM faculty_profile fp
          JOIN faculty_login fl ON fp.login_id = fl.login_id
          WHERE fl.faculty_code = $1
        )
      ORDER BY sa.cgpa ASC`;

    const result = await pool.query(query, [req.user.faculty_code]);

    res.json({ count: result.rowCount, students: result.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch weak students" });
  }
};
/* Get Top Students (CGPA > 8.5) */
exports.getTopStudents = async (req, res) => {
  try {
    if (req.user.role !== "faculty")
      return res.status(403).json({ error: "Access denied" });

    const result = await pool.query(`
      SELECT sl.login_id, sl.roll_no, sa.name, sa.department, sa.cgpa
      FROM student_login sl
      JOIN student_academic sa ON sl.login_id = sa.login_id
      WHERE sl.is_active = true
        AND sa.cgpa > 8.5
        AND sa.department = (
          SELECT fp.department
          FROM faculty_profile fp
          JOIN faculty_login fl ON fp.login_id = fl.login_id
          WHERE fl.faculty_code = $1
        )
      ORDER BY sa.cgpa DESC
    `, [req.user.faculty_code]);

    res.json({ count: result.rowCount, students: result.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top students" });
  }
};


/* Dashboard statistics */
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res.status(403).json({ error: "Access denied" });
    }

    const facultyCode = req.user.faculty_code;
    console.log("[FACULTY ANALYTICS] Fetching dashboard stats for faculty:", facultyCode);

    // 1. Basic Counts & CGPA Distribution
    const statsQuery = `
            SELECT 
                COUNT(*) as total_students,
                COUNT(CASE WHEN sa.cgpa >= 9 THEN 1 END) as cgpa_9_10,
                COUNT(CASE WHEN sa.cgpa >= 8 AND sa.cgpa < 9 THEN 1 END) as cgpa_8_9,
                COUNT(CASE WHEN sa.cgpa >= 7 AND sa.cgpa < 8 THEN 1 END) as cgpa_7_8,
                COUNT(CASE WHEN sa.cgpa >= 6 AND sa.cgpa < 7 THEN 1 END) as cgpa_6_7,
                COUNT(CASE WHEN sa.cgpa < 6 THEN 1 END) as cgpa_below_6,
                AVG(sa.cgpa) as average_cgpa
            FROM student_academic sa
            WHERE sa.department = (
                SELECT department 
                FROM faculty_profile fp 
                JOIN faculty_login fl ON fp.login_id = fl.login_id 
                WHERE fl.faculty_code = $1
            )
        `;
    const statsResult = await pool.query(statsQuery, [facultyCode]);
    const basicStats = statsResult.rows[0];

    // 2. Placement Stats
    const placementQuery = `
            SELECT 
                COUNT(CASE WHEN LOWER(p.status) = 'selected' OR LOWER(p.status) = 'placed' THEN 1 END) as placed,
                COUNT(CASE WHEN LOWER(p.status) = 'rejected' OR LOWER(p.status) = 'not placed' THEN 1 END) as rejected,
                COUNT(CASE WHEN LOWER(p.status) = 'pending' OR p.status IS NULL THEN 1 END) as pending
            FROM student_academic sa
            LEFT JOIN placement p ON sa.login_id = p.student_id
            WHERE sa.department = (
                SELECT department 
                FROM faculty_profile fp 
                JOIN faculty_login fl ON fp.login_id = fl.login_id 
                WHERE fl.faculty_code = $1
            )
        `;
    const placementResult = await pool.query(placementQuery, [facultyCode]);
    const placementStats = placementResult.rows[0];
    console.log("[FACULTY ANALYTICS] Placement Stats:", placementStats);

    // 3. Top Students (Limit 5)
    const topStudentsQuery = `
            SELECT sa.name, sa.cgpa, sa.department
            FROM student_academic sa
            WHERE sa.department = (
                SELECT department FROM faculty_profile fp JOIN faculty_login fl ON fp.login_id = fl.login_id WHERE fl.faculty_code = $1
            )
            ORDER BY sa.cgpa DESC
            LIMIT 5
        `;
    const topStudentsResult = await pool.query(topStudentsQuery, [facultyCode]);

    // 4. Weak Students (Limit 5)
    const weakStudentsQuery = `
            SELECT sa.name, sa.cgpa, sa.department
            FROM student_academic sa
            WHERE sa.cgpa < 6.0 AND sa.department = (
                SELECT department FROM faculty_profile fp JOIN faculty_login fl ON fp.login_id = fl.login_id WHERE fl.faculty_code = $1
            )
            ORDER BY sa.cgpa ASC
            LIMIT 5
        `;
    const weakStudentsResult = await pool.query(weakStudentsQuery, [facultyCode]);

    res.json({
      count: 1,
      data: {
        total_students: parseInt(basicStats.total_students || 0),
        average_cgpa: parseFloat(basicStats.average_cgpa || 0).toFixed(2),
        cgpa_distribution: {
          '9-10': parseInt(basicStats.cgpa_9_10 || 0),
          '8-9': parseInt(basicStats.cgpa_8_9 || 0),
          '7-8': parseInt(basicStats.cgpa_7_8 || 0),
          '6-7': parseInt(basicStats.cgpa_6_7 || 0),
          '<6': parseInt(basicStats.cgpa_below_6 || 0),
        },
        placement_stats: {
          placed: parseInt(placementStats.placed || 0),
          rejected: parseInt(placementStats.rejected || 0),
          pending: parseInt(placementStats.pending || 0)
        },
        top_students: topStudentsResult.rows,
        weak_students: weakStudentsResult.rows
      }
    });

  } catch (err) {
    console.error("[FACULTY ANALYTICS ERROR]:", err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};
/* Get Placement Ratio */
exports.getFacultyPlacementRatio = async (req, res) => {
  try {
    if (req.user.role !== "faculty")
      return res.status(403).json({ error: "Access denied" });

    const { faculty_code } = req.user;
    if (!faculty_code)
      return res.status(400).json({ error: "Invalid token" });

    const { rows } = await pool.query(`
      WITH s AS (
        SELECT sa.login_id,
          CASE WHEN EXISTS (
            SELECT 1 FROM placement p
            WHERE p.student_id = sa.login_id
              AND LOWER(p.status) IN ('selected','placed')
          ) THEN 1 ELSE 0 END AS placed
        FROM student_academic sa
        WHERE sa.department = (
          SELECT fp.department
          FROM faculty_profile fp
          JOIN faculty_login fl ON fp.login_id = fl.login_id
          WHERE fl.faculty_code = $1
        )
      )
      SELECT
        COUNT(*) total_students,
        SUM(placed) placed_students,
        COUNT(*) - SUM(placed) unplaced_students,
        COALESCE(ROUND(SUM(placed)*100.0/NULLIF(COUNT(*),0),2),0) placed_percentage,
        COALESCE(ROUND((COUNT(*)-SUM(placed))*100.0/NULLIF(COUNT(*),0),2),0) unplaced_percentage
      FROM s
    `, [faculty_code]);

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

