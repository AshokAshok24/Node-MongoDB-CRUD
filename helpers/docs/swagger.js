require('dotenv').config();


const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
    info: {
        version: '1.0.0',
        title: "Node-MongoDB CRUD-API's",
        description: "A CRUD Operation by Nodejs and MongoDB with JOI Validation Library"

    },
    servers: [
        {
            url: `http://${process.env.SWAGGER_HOST}:${process.env.SWAGGER_PORT}`,
            description: 'Development'
        },
        {
            url: `http://${process.env.SWAGGER_HOST}:${process.env.SWAGGER_PORT}`,
            description: 'Production'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "apiKey",
                name: "x-auth-token",
                type: "http",
                scheme: "bearer",
                in: "header",
            },
        },
    },
    security: [{
        bearerAuth: [],
    },],

};

const outputFile = './helpers/docs/swagger.json';
const endpointsFiles = ['./index.js', './controller/*.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);