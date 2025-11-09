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




//get all chats for a singular user
router.get('/chats/:userId', async (req, res) => {
    try {
        const chats = await groupChat.find({members: req.params.userId}).select('chatName post updatedAt').lean();
        res.json(chats);
    }
    catch (error) {
        res.status(400).json({error: "Could not find chats"});
    }
});


//get the chat for a particular post 
router.get('/getByPost/:postId', async (req, res) => {
    try {
        const chat = await groupChat.findOne({post: req.params.postId})
        .populate('members', 'username email _id')
        .lean();
        if(!chat) {
            return res.status(400).json({error: 'no chat found for this post'});
        }
        res.json(chat);
    }
    catch(error) {
        res.status(400).json({error: "could not find chat for post"});
    } 
});

//leave a group chat 
router.post('/:id/leave', async (req, res) => {
    try {
        const { userId } = req.body;
        const chat = await groupChat.findByIdAndUpdate(req.params.id, {
            $pull: {members: userId} },
            {new: true}
        ).lean();
        res.json(chat);
    }
    catch (error) {
        res.status(400).json({error: "could not leave ):"});
    }

});



//get single chat by id
router.get('/:id', async (req, res) => {
    try {
        const chat = await groupChat.findById(req.params.id).populate('members', 'name email _id').lean();
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
