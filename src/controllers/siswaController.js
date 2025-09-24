const { pool } = require('../config/database');
const logger = require('../logger');

async function getSiswa(req, res) {
    try {
        const result = await pool.query('SELECT * FROM siswa ORDER BY id ASC');
        logger.info('Fetched all siswa data');
        res.json(result.rows);
    } catch (err) {
        logger.error({ err }, 'Error fetching siswa');
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createSiswa(req, res) {
    const { nama, kelas, pesan } = req.body;

    if (!nama || !kelas) {
        logger.warn('Attempt to create siswa without nama/kelas');
        return res.status(400).json({ error: 'Nama dan kelas wajib diisi' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO siswa (nama, kelas, pesan) VALUES ($1, $2, $3) RETURNING *`,
            [nama, kelas, pesan || null]
        );
        logger.info({ siswa: result.rows[0] }, 'Siswa created successfully');
        res.status(201).json(result.rows[0]);
    } catch (err) {
        logger.error('Error inserting siswa', { err });
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getSiswa, createSiswa };
