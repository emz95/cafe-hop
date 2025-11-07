const express = require('express');

const groupChat = require('../models/GroupChat');

const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const chat = await groupChat.create(req.body);
        res.status(201).json(chat);

    }
    catch (error) {
        res.status(400).json({error: "could not create"});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const chat = groupChat.findbyid(req.params.id);
        if(!chat) {
            return res.status(404).json({error: 'Chat not found'});
        }
        res.json(chat);

    }
    catch (err) {
        res.status(400).json({error: err.message})
    }
});

module.exports = router; 
