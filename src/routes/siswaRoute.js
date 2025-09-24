const express = require('express');
const { getSiswa, createSiswa, uploadFoto, deleteSiswa, deleteAllSiswa } = require('../controllers/siswaController');
const upload = require('../config/multer');

const router = express.Router();

// Debug middleware for siswa routes
router.use((req, res, next) => {
    console.log(`Siswa route: ${req.method} ${req.path}`);
    next();
});

router.get('/', getSiswa);
router.post('/', createSiswa);
router.delete('/', deleteAllSiswa);  // Move deleteAll before delete by ID
router.post('/:id/foto', upload.single('foto'), uploadFoto);
router.delete('/:id', deleteSiswa);

module.exports = router;
