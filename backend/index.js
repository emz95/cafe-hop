const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log('MongoDB Connected');
        app.listen(3000, () => console.log('API on http://localhost:3000'))
    } catch (err) {
        console.error("Mongo connect error:", err.message);
        process.exit(1);
    }
}

start();



app.get('/testing', (req, res) => {
    res.send("good day");
});

app.listen(3000, () => {
    console.log("all operational");
});


