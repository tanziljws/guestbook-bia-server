const { checkConnection } = require('./src/config/database');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
    await checkConnection();

    app.listen(PORT, () => {
        console.info(`Server running at http://localhost:${PORT} in ${NODE_ENV} mode`);
    });
}

startServer();
