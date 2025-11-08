const express = require('express');

const groupChat = require('../models/GroupChat');

const router = express.Router();


// router.post('/', async (req, res) => {
//     try {
//         const chat = await groupChat.create(req.body);
//         res.status(201).json(chat);

//     }
//     catch (error) {
//         res.status(400).json({error: "could not create"});
//     }
// });

router.get('/:id', async (req, res) => {
    try {
        const chat = groupChat.findbyid(req.params.id).populate('members');
        if(!chat) {
            return res.status(404).json({error: 'Chat not found'});
        }
        res.json(chat);

    }
    catch (err) {
        res.status(400).json({error: err.message})
    }
});

router.get('/chats/:userId', async () => {
    try {
        chats = await groupChat.find({members: req.params.userId}).lean();
        res.json(chats);
    }
    catch (error) {
        res.status(400).json({error: "Could not find chats"});
    }
});

router.post('/leave', async () => {
    try {
        const chat = await GroupChat.findByIdAndUpdate(req.params.id, {
            $pull: {members: req.body} },
            {new: true}
        ).lean();
        res.json(chat);

    }
    catch (error) {
        res.status(400).json({error: "could not leave ):"});
    }

});

module.exports = router; 
