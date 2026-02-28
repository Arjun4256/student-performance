const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminPayload = {
    login_id: 1,
    role: 'admin'
};

const secret = process.env.JWT_SECRET || 'your_jwt_secret';
const adminToken = jwt.sign(adminPayload, secret, { expiresIn: '1h' });

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
                resolve({
                    status: res.statusCode,
                    contentType: res.headers['content-type'],
                    contentDisposition: res.headers['content-disposition']
                });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}

async function runTests() {
    console.log('--- Testing Report Endpoints ---');
    try {
        const r1 = await testEndpoint('/reports/eligible-list', adminToken);
        console.log('Eligible List Report:', r1);

        const r2 = await testEndpoint('/reports/performance-summary', adminToken);
        console.log('Performance Summary Report:', r2);

    } catch (e) {
        console.log('Test Error (Is server running?):', e.message);
    }
}

runTests();
