const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Performance and Analytics System API',
            version: '1.0.0',
            description: 'API documentation for the Student Performance and Analytics System',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [
        path.join(__dirname, '../routes/auth/*.js'),
        path.join(__dirname, '../routes/*.js')
    ], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
