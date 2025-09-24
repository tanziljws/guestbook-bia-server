const { Pool } = require('pg');
const logger = require('../logger');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Helper function to check DB connection
async function checkConnection() {
    try {
        await pool.query('SELECT 1');
        logger.info('Database connected successfully');
    } catch (err) {
        logger.error('Database connection failed:', err.message);
        process.exit(1);
    }
}

module.exports = { pool, checkConnection };