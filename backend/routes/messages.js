const express = require('express');

const Message = require('../models/Message');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const message = await Message.create(req.body);
        res.status(201).json(message);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:GroupChatId', async (req, res) => {
    try {
        const messages = await Message.find({group: req.params.GroupChatId})
        .sort({createdAt: 1})
        .populate('sender', 'username _id')
        .lean();
        res.json(messages);
    }
    catch (error) {
        res.status(404).json({error: "could not find gc"});

    }

});

module.exports = router;