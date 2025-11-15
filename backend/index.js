const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

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


