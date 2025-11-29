const asyncHandler = require('express-async-handler');

const express = require('express');

const GroupChat = require('../models/GroupChat');

const JoinRequest = require('../models/JoinRequest');

const Post = require('../models/Post');


//makes join request 
const makeJoinRequest = asyncHandler(async (req, res) => {
    const {post, poster, requester, message} = req.body;
    const joinRequest = await JoinRequest.create({
        post,
        poster,
        requester,
        message,
        status: 'Pending'
    });
    res.status(201).json(joinRequest);
});

//approve a join request
const approveJoinRequest = asyncHandler(async (req, res) => {
    const joinRequest = await JoinRequest.findByIdAndUpdate(
        req.params.id,
        {status: 'Approved'},
        {new: true}
    ).lean();
    
    if(!joinRequest) {
        res.status(404);
        throw new Error('Join Request not found');
    }
    
    const doc = await Post.findById(joinRequest.post).select('cafeName').lean();
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
})

//reject a join request 
const rejectJoinRequest = asyncHandler(async (req, res) => {
    const joinRequest = await JoinRequest.findByIdAndUpdate(
        req.params.id, 
        {status: "Rejected"},
        {new: true}
    ).lean();
    if(!joinRequest) {
        res.status(404);
        throw new Error('Join Request not found');
    }
    res.json(joinRequest);
});

const getJoinRequestsForPost = asyncHandler(async (req, res) => {
    const requests = await JoinRequest.find({
        post: req.params.postId,
        status: 'Pending', 
    })
    .populate('poster', 'username email _id')
    .populate('requester', 'username email _id')
    .populate('post', 'cafeName location date dateGoing time _id')
    .sort({createdAt: -1})
    .lean();
    res.json(requests);
});

const getJoinRequestsForPoster = asyncHandler(async (req, res) => {
    const requests = await JoinRequest.find({
         poster: req.params.posterId, 
         status: 'Pending' 
        })
        .populate('requester', 'username email _id')
        .populate('post', 'cafeName location date dateGoing time _id')
        .sort({createdAt: -1})
        .lean();
    res.json(requests);

});

const getAllJoinRequestsForRequester = asyncHandler(async (req, res) => {
    const requests = await JoinRequest.find({
        requester: req.params.requesterId,
    })
    .populate('poster', 'username email _id')
    .populate('post', 'cafeName location date time _id')
    .sort({createdAt: -1})
    .lean();
    res.json(requests);
});


const getJoinRequestsForRequester = asyncHandler(async (req, res) => {
    const requests = await JoinRequest.find({
            requester: req.params.requesterId,
            status: 'Pending'
        })
        .populate('poster', 'username email _id')
        .populate('post')
        .sort({createdAt: -1})
        .lean();
    res.json(requests);

});



module.exports = {
    makeJoinRequest,
    approveJoinRequest,
    rejectJoinRequest,
    getJoinRequestsForPost,
    getJoinRequestsForPoster,
    getAllJoinRequestsForRequester,
    getJoinRequestsForRequester
}; 



// router.get('/', async (req, res) => {
//     try {
//         const joinRequests = await JoinRequest.find().lean()
//     }

// });

