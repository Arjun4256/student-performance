const http = require('http');
const { generateToken } = require('../utils/jwt.util');

const adminPayload = {
    admin_id: 2,
    role: 'admin'
};

const studentPayload = {
    login_id: 17,
    roll_no: '20G302',
    email: 'test@student.com',
    role: 'student'
};

const adminToken = generateToken(adminPayload);
const studentToken = generateToken(studentPayload);

async function testEndpoint(path, token, method = 'GET') {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
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
                try {
                    resolve({ status: res.statusCode, data: data.startsWith('{') || data.startsWith('[') ? JSON.parse(data) : data.substring(0, 50) + '...' });
                } catch (e) {
                    resolve({ status: res.statusCode, data: 'Non-JSON response' });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}

async function runTests() {
    console.log('--- Testing Admin Dashboard ---');
    try {
        const s1 = await testEndpoint('/api/admin/dashboard/stats', adminToken);
        console.log('Overview Stats:', s1);
    } catch (e) {
        console.log('Admin Dashboard Error:', e.message);
    }

    console.log('\n--- Testing Advanced Analytics ---');
    try {
        const a1 = await testEndpoint('/analytics/analytics/eligibility', adminToken);
        console.log('Eligibility:', a1);

        const a2 = await testEndpoint('/analytics/analytics/cutoff', adminToken);
        console.log('Cutoff Analysis:', a2);

        const a3 = await testEndpoint('/analytics/analytics/readiness', adminToken);
        console.log('Readiness Index:', a3);
    } catch (e) {
        console.log('Analytics Error:', e.message);
    }

    console.log('\n--- Testing Search & Filters ---');
    try {
        const f1 = await testEndpoint('/admin/students?search=Arjun', adminToken);
        console.log('Student Search:', f1.status === 200 ? 'OK' : f1);

        const f2 = await testEndpoint('/admin/faculty?department=CSE', adminToken);
        console.log('Faculty Filter:', f2.status === 200 ? 'OK' : f2);
    } catch (e) {
        console.log('Filter Error:', e.message);
    }

    console.log('\n--- Testing Reports ---');
    try {
        const r1 = await testEndpoint('/api/reports/eligible-list', adminToken);
        console.log('Eligible List CSV:', r1.status === 200 ? 'OK (CSV Received)' : r1);

        const r2 = await testEndpoint('/api/reports/performance-summary', adminToken);
        console.log('Performance Summary CSV:', r2.status === 200 ? 'OK (CSV Received)' : r2);
    } catch (e) {
        console.log('Report Error:', e.message);
    }
}

runTests();
