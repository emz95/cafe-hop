const express = require('express');

const GroupChat = require('../models/GroupChat');

const JoinRequest = require('../models/JoinRequest');

const Post = require('../models/Post');

const router = express.Router();

//create a join request 
router.post('/', async (req, res) => {
    try {
        const joinRequest = await JoinRequest.create(req.body);
        res.status(201).json(joinRequest);
    }
    catch (error) {
        res.status(400).json({error: "could not make Join Request"});
    }

});


//approve a join request 
router.post('/:id/approve', async (req, res) => {
    try {
        const joinRequest = await JoinRequest.findByIdAndUpdate(
            req.params.id,
            {status: 'Approved'},
            {new: true}
        ).lean();

        if(!joinRequest) {
            res.status(404).json({error: "not found"});
            return;
        }
        const doc = await Post.findById(joinRequest.post).select('title').lean();
        const nameChat = doc.title;
        const groupChat = await GroupChat.findOneAndUpdate(
            {post: joinRequest.post},
            {
                $setOnInsert: {
                    chatName: nameChat,
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
        res.status(400).json({error: err.message});
        return;
    }
    });


//reject a join request 

router.post('/:id/reject', async (req, res) => {
    try {
        const joinRequest = await JoinRequest.findByIdAndUpdate(
            req.params.id, 
            {status: "Rejected"},
            {new: true}
        ).lean();
        res.json(joinRequest);
    }
    catch (err) {
        res.status(400).json({error: err.message});
        
    }
});

//find all the join requests for a post 
router.get('/getByPost/:postId', async (req, res) => {
    try {
        const requests = await JoinRequest.find({
            post: req.params.postId,
            status: 'Pending', 
        })
        .populate('poster', 'username email _id')
        .populate('requester', 'username email _id')
        .populate('post', 'title _id')
        .sort({createdAt: -1})
        .lean();
        res.json(requests);

    }
    catch (error) {
        res.status(404).json({error: "could not find join requests for this postId"});
    }

});


//find all join requests for a particular user 
router.get('/getByPoster/:posterId', async(req, res) => {
    try {
        const requests = await JoinRequest.find({
             poster: req.params.posterId, 
             status: 'Pending' 
            })
            .populate('requester', 'username email _id')
            .populate('post', 'title _id')
            .sort({createdAt: -1})
            .lean();
            res.json(requests);
    }
    catch (error) {
        res.status(404).json({error: "could not find chats for this userId"});
    }
});

module.exports = router; 



// router.get('/', async (req, res) => {
//     try {
//         const joinRequests = await JoinRequest.find().lean()
//     }

// });

