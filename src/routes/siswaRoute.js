const express = require('express');
const { getSiswa, createSiswa, uploadFoto } = require('../controllers/siswaController');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', getSiswa);
router.post('/', createSiswa);
router.post('/:id/foto', upload.single('foto'), uploadFoto);

module.exports = router;
