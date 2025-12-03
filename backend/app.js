const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors")
const cookieParser = require('cookie-parser')

require('dotenv').config();
const app = express();
app.use(cookieParser())
app.use(cors({origin: "http://localhost:5174", credentials: true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const joinRequestsRouter = require('./routes/joinRequests');
const messageRouter = require('./routes/messages');
const chatRouter = require('./routes/groupChats');
const cafeRouter = require('./routes/cafe');
const cafeReviews = require('./routes/cafeReviews'); 



app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/joinRequests', joinRequestsRouter);
app.use('/api/messages', messageRouter);
app.use('/api/groupchats', chatRouter);
app.use('/api/cafes', cafeRouter); 
app.use('/api/cafeReviews', cafeReviews);


app.get('/testing', (req, res) => {
    res.send("good day");
});



  
app.post("/test/reset", async (req, res) => {
    try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
    res.status(200).json({ message: "Database reset" });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
    }
});

const seedCafes = require('./cafeSeeder');

app.post('/test/seed-cafes', async (req, res) => {
  try {
    const result = await seedCafes();
    res.json({
      message: "Cafes seeded",
      count: result.count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = app; 