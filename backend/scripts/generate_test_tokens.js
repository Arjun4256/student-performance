const { generateToken } = require('../utils/jwt.util');

const studentPayload = {
    login_id: 17,
    roll_no: '20G302',
    email: 'test@student.com',
    role: 'student'
};

const facultyPayload = {
    faculty_login_id: 7,
    faculty_code: 'AI105',
    role: 'faculty'
};

const studentToken = generateToken(studentPayload);
const facultyToken = generateToken(facultyPayload);

console.log('STUDENT_TOKEN=' + studentToken);
console.log('FACULTY_TOKEN=' + facultyToken);
