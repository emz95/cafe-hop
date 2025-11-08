const express = require('express');

const GroupChat = require('../models/GroupChat');

const JoinRequest = require('../models/JoinRequest');

const post = require('../models/Post');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const joinRequest = await JoinRequest.create(req.body);
        res.status(201).json(joinRequest);
    }
    catch (error) {
        res.status(400).json({error: "could not make Join Request"});
    }

});

router.post('/:id/approve', async (req, res) => {
    try {
        const joinRequest = await JoinRequest.findbyIdAndUpdate(
            req.params.id,
            {status: 'Approved'},
            {new: true}
        ).lean();

        if(!joinRequest) {
            res.status(404).json({error: "not found"});
            return;
        }
        const groupChat = await GroupChat.findOneAndUpdate(
            {post: joinRequest.post},
            {
                $setOnInsert: {
                    chatName: GroupChat.findById(joinRequest.post).select('title').lean(),
                    post: joinRequest.post,
                    postAuthor: joinRequest.poster
                },
                $addToSet: {members: {$each: [joinRequest.requester, joinRequest.poster] }}
            },
            { new: true, upsert: true }
        ).lean();
        res.json({joinRequest, groupChat});
    }
    catch(err) {
        res.status(404).json({error: err.message});
        return;
    }
    });

router.post('/:id/reject', async (req, res) => {
    try {
        const joinRequest = await JoinRequest.findbyIdAndUpdate(
            req.params.id, 
            {status: "Rejected"},
            {new: true}
        ).lean();
        res.json(joinRequest);
    }
    catch (err) {
        res.status(404).json({error: err.message});
        
    }
});

module.exports = router; 



// router.get('/', async (req, res) => {
//     try {
//         const joinRequests = await JoinRequest.find().lean()
//     }

// });

