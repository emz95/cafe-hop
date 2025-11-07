const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const joinRequestsRouter = require('./routes/joinRequests');
const messageRouter = require('./routes/messages');

app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/joinRequests', joinRequestsRouter);
app.use('/api/messages', messageRouter);

app.get('/testing', (req, res) => {
    res.send("good day");
});


async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log('MongoDB Connected');
        app.listen(3000, () => {
            console.log('API on http://localhost:3000')
        });
    } catch (err) {
        console.error("Mongo connect error:", err.message);
        process.exit(1);
    }
}

start();



// app.listen(3000, () => {
//     console.log("all operational");
// });


