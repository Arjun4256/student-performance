const http = require('http');
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

async function testEndpoint(path, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({ status: res.statusCode, data: JSON.parse(data) });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}

async function runTests() {
    console.log('--- Testing Student Analytics ---');
    try {
        const p1 = await testEndpoint('/api/student/performance', studentToken);
        console.log('Performance indicators:', p1);

        const p2 = await testEndpoint('/api/student/analytics/trend', studentToken);
        console.log('CGPA Trend:', p2);

        const p3 = await testEndpoint('/api/student/analytics/progress', studentToken);
        console.log('Semester Progress:', p3);
    } catch (e) {
        console.log('Student Test Error (Is server running?):', e.message);
    }

    console.log('\n--- Testing Faculty Analytics ---');
    try {
        const f1 = await testEndpoint('/api/faculty/students', facultyToken);
        console.log('Student List:', f1);

        const f2 = await testEndpoint('/api/faculty/analytics/weak', facultyToken);
        console.log('Weak Students:', f2);

        const f3 = await testEndpoint('/api/faculty/analytics/top', facultyToken);
        console.log('Top Students:', f3);
    } catch (e) {
        console.log('Faculty Test Error (Is server running?):', e.message);
    }
}

runTests();
