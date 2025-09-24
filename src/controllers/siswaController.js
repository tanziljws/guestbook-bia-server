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
    const { nama, kelas, pesan, tanggal_kunjungan } = req.body;

    if (!nama || !kelas) {
        logger.warn('Attempt to create siswa without nama/kelas');
        return res.status(400).json({ error: 'Nama dan kelas wajib diisi' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO siswa (nama, kelas, pesan, tanggal_kunjungan) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nama, kelas, pesan || null, tanggal_kunjungan || new Date()]
        );
        logger.info({ siswa: result.rows[0] }, 'Siswa created successfully');
        res.status(201).json(result.rows[0]);
    } catch (err) {
        logger.error('Error inserting siswa', { err });
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function uploadFoto(req, res) {
    const { id } = req.params;

    if (!req.file) {
        return res.status(400).json({ error: 'Foto tidak ditemukan' });
    }

    try {
        const fotoPath = req.file.filename;
        const result = await pool.query(
            `UPDATE siswa SET foto = $1 WHERE id = $2 RETURNING *`,
            [fotoPath, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Siswa tidak ditemukan' });
        }

        logger.info({ siswa: result.rows[0] }, 'Foto uploaded successfully');

        const siswa = result.rows[0];
        siswa.foto_url = `${req.protocol}://${req.get('host')}/uploads/siswa/${fotoPath}`;

        res.json(siswa);
    } catch (err) {
        logger.error({ err }, 'Error uploading foto');
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getSiswa, createSiswa, uploadFoto };
