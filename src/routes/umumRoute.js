const express = require('express');
const { getUmum, createUmum } = require('../controllers/umumController');

const router = express.Router();

router.get('/', getUmum);
router.post('/', createUmum);

module.exports = router;
