const express = require('express');

const User = require('../models/User');

const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    }
    catch(err) {
        res.status(400).json({error: err.message});
    }
});

router.get('/', async (_req, res) => {
    const users = await User.find().lean();
    res.json(users);
});



module.exports = router;
