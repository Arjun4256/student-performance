const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3000';

async function verify() {
    try {
        console.log('--- Verifying Placement Routes ---');

        // Note: In a real scenario, we'd login to get a token. 
        // For this verification, we assumes the server is running and we can try to hit the endpoints.
        // If they return 401, it at least confirms the route is registered and protected by verifyToken.

        const endpoints = [
            '/admin/placement/placed',
            '/admin/placement/unplaced'
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`Testing GET ${endpoint}...`);
                const response = await axios.get(`${BASE_URL}${endpoint}`);
                console.log(`SUCCESS: ${endpoint} returned ${response.status}`);
                console.log('Data:', JSON.stringify(response.data.slice(0, 2), null, 2));
            } catch (err) {
                if (err.response) {
                    console.log(`INFO: ${endpoint} returned status ${err.response.status} (Expected if not authenticated: 401/403)`);
                } else {
                    console.error(`ERROR: Failed to connect to ${endpoint}:`, err.message);
                }
            }
        }

    } catch (err) {
        console.error('Verification failed:', err.message);
    }
}

verify();
