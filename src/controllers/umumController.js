const { pool } = require('../config/database');
const logger = require('../logger');

async function getUmum(req, res) {
    try {
        const result = await pool.query('SELECT * FROM umum ORDER BY id ASC');
        logger.info('Fetched all umum data');
        res.json(result.rows);
    } catch (err) {
        logger.error({ err }, 'Error fetching umum');
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createUmum(req, res) {
    const { nama, nama_instansi, pesan } = req.body;

    if (!nama || !nama_instansi) {
        logger.warn('Attempt to create umum without nama/nama_instansi');
        return res.status(400).json({ error: 'Nama dan instansi wajib diisi' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO umum (nama, nama_instansi, pesan) VALUES ($1, $2, $3) RETURNING *`,
            [nama, nama_instansi, pesan || null]
        );
        logger.info({ umum: result.rows[0] }, 'Umum created successfully');
        res.status(201).json(result.rows[0]);
    } catch (err) {
        logger.error({ err }, 'Error inserting umum');
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getUmum, createUmum };
