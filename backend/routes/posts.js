const express = require('express');

const Post = require('../models/Post');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const post = await Post.create(req.body);
        res.status(201).json(post);
    }
    catch (error) {
        res.status(400).json({error: err.message});
    }
});

router.get('/', async (_req, res) => {
    const posts = await Post.find().lean();
    res.json(posts);

});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id; 
        const post = await Post.findById(id).populate('author').lean();
        if(!post) {
            res.status(404).json({error: "post not found"});
            return;
        }   
        res.json(post);
    }
    catch (err) {
        res.status(400).json({error: err.message});
    }



});

module.exports = router; 

