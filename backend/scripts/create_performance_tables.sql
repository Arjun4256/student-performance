CREATE TABLE IF NOT EXISTS student_semester_performance (
    performance_id SERIAL PRIMARY KEY,
    login_id INTEGER REFERENCES student_login(login_id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    sgpa NUMERIC(4,2),
    cgpa NUMERIC(4,2),
    created_at TIMESTAMP DEFAULT NOW()
);
