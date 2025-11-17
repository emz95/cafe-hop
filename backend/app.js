const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors")

require('dotenv').config();
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const joinRequestsRouter = require('./routes/joinRequests');
const messageRouter = require('./routes/messages');
const chatRouter = require('./routes/groupChats');


app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/joinRequests', joinRequestsRouter);
app.use('/api/messages', messageRouter);
app.use('/api/chats', chatRouter);
app.use('/api/users', usersRouter);



app.get('/testing', (req, res) => {
    res.send("good day");
});


module.exports = app; 