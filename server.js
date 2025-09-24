const { checkConnection } = require('./src/config/database');
const app = require('./app');
const logger = require('./src/logger');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
    await checkConnection();

    app.listen(PORT, () => {
        logger.info(`Server running at http://localhost:${PORT} in ${NODE_ENV} mode`);
    });
}

startServer();
