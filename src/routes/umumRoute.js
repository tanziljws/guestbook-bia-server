const express = require('express');
const { getUmum, createUmum, deleteUmum, deleteAllUmum } = require('../controllers/umumController');

const router = express.Router();

router.get('/', getUmum);
router.post('/', createUmum);
router.delete('/', deleteAllUmum);  // Move deleteAll before delete by ID
router.delete('/:id', deleteUmum);

module.exports = router;
