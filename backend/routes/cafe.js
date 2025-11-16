const express = require('express');

const { getCafes, createCafe } = require('../controllers/cafeController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createCafe);

router.get('/', getCafes); 

module.exports = router; 