const express = require('express');
const { getSiswa, createSiswa } = require('../controllers/siswaController');

const router = express.Router();

router.get('/', getSiswa);
router.post('/', createSiswa);

module.exports = router;
