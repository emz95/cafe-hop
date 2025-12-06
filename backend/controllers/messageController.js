const asyncHandler = require('express-async-handler');

const Message = require('../models/Message');

const createMessage = asyncHandler(async (req, res) => {
    const message = await Message.create({
        sender: req.user._id,
        group: req.body.group,
        text: req.body.text,
    });
    res.status(201).json(message); 

})

//given a group chat ID, get all messages for that group chat
const getMessagesByGroupChat = asyncHandler(async (req, res) => {
    const messages = await Message.find({group: req.params.groupChatId}).
    sort({createdAt: -1}).
    populate('sender', '_id username').
    lean(); 
    res.json(messages); 


});

module.exports = {
    createMessage,
    getMessagesByGroupChat
};