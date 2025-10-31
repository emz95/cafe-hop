const express = require('express');

const app = express();

app.get('/testing', (req, res) => {
    res.send("good day");
});

app.listen(3000, () => {
    console.log("all operational");
});

