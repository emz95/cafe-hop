const express = require('express');

const { createMessage, getMessagesByGroupChat } = require('../controllers/messageController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createMessage);

router.get('/:groupChatId', protect, getMessagesByGroupChat);


module.exports = router;