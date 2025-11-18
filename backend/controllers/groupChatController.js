const asyncHandler = require('express-async-handler');

const GroupChat = require('../models/GroupChat');


//get all chats for a singular user
const getChatsForUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const chats = await GroupChat.find({members: userId}).
    select('chatName post updatedAt').
    lean();

    res.json(chats);
});


//gets the chat for a particular post
const getChatForPost = asyncHandler(async (req, res) => {
    const chat = await GroupChat.findOne({post: req.params.postId}).
    populate('members', 'username email _id').
    lean();
    if(!chat) {
        return res.status(400).json({error: 'no chat found for this post'});
    }
    res.json(chat);
});


//leave a group chat
const leaveGroupChat = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    if(!userId) {
        res.status(400);
        throw new Error('User ID is required to leave the chat');
    }

    const chat = await GroupChat.findByIdAndUpdate(req.params.id, {
        $pull: {members: userId} },
        {new: true}
    );
    if(!chat) {
        return res.status(404).json({error: 'Chat not found'});
    }
    res.json(chat);

});

//uses id param to get a single chat 
const getSingleChatById = asyncHandler(async (req, res) => {
    const chat = await GroupChat.findById(req.params.id).
    populate('members', 'username email _id').
    lean();
    res.json(chat);
    if(!chat) {
        return res.status(404).json({error: 'Chat not found'});
    }

});

module.exports = {
    getChatsForUser,
    getChatForPost,
    leaveGroupChat,
    getSingleChatById
};
//c
// router.post('/', async (req, res) => {
//     try {
//         const chat = await groupChat.create(req.body);
//         res.status(201).json(chat);

//     }
//     catch (error) {
//         res.status(400).json({error: "could not create"});
//     }
// });




// //get all chats for a singular user
// router.get('/chats/:userId', async (req, res) => {
//     try {
//         const chats = await groupChat.find({members: req.params.userId}).select('chatName post updatedAt').lean();
//         res.json(chats);
//     }
//     catch (error) {
//         res.status(400).json({error: "Could not find chats"});
//     }
// });


// //get the chat for a particular post 
// router.get('/getByPost/:postId', async (req, res) => {
//     try {
//         const chat = await groupChat.findOne({post: req.params.postId})
//         .populate('members', 'username email _id')
//         .lean();
//         if(!chat) {
//             return res.status(400).json({error: 'no chat found for this post'});
//         }
//         res.json(chat);
//     }
//     catch(error) {
//         res.status(400).json({error: "could not find chat for post"});
//     } 
// });

// //leave a group chat 
// router.post('/:id/leave', async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const chat = await groupChat.findByIdAndUpdate(req.params.id, {
//             $pull: {members: userId} },
//             {new: true}
//         ).lean();
//         res.json(chat);
//     }
//     catch (error) {
//         res.status(400).json({error: "could not leave ):"});
//     }

// });



// //get single chat by id
// router.get('/:id', async (req, res) => {
//     try {
//         const chat = await groupChat.findById(req.params.id).populate('members', 'username email _id').lean();
//         if(!chat) {
//             return res.status(404).json({error: 'Chat not found'});
//         }
//         res.json(chat);

//     }
//     catch (err) {
//         res.status(400).json({error: err.message})
//     }
// });





// module.exports = router; 
