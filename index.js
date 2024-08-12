const express = require('express');
const app = express();
var cors = require('cors');
require('dotenv').config()


app.use(express.json());




var corsOptions = {
    origin: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

app.use(cors(corsOptions));



const users = require('./controller/users/index');

app.use("/users", users)


const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./helpers/docs/swagger.json');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});
