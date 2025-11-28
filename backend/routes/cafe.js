const express = require('express');

const { getCafes, createCafe, getCafeByID } = require('../controllers/cafeController');

const router = express.Router();

router.post('/', createCafe);
router.get('/', getCafes); 
router.get('/:id', getCafeByID)

module.exports = router; 