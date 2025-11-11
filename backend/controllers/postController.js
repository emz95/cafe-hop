const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Post = require('../models/Post')



const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().populate('author', 'username')
    if (posts.length === 0) {
        return res.status(200).json({ message: 'No posts yet' })
    }
    res.status(200).json(posts)
})

const createPost = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const post = await Post.create({
        author: req.user.id,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        isOpenToJoin: req.body.isOpenToJoin
    })
    if (!post) {
        res.status(400)
        throw new Error('Failed to create post')
    }
    res.status(201).json(post)
})

const deletePost = asyncHandler( async (req, res) => {
    if (!req.user || !req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const deleted = await Post.findOneAndDelete({
        _id: req.params.id,
        author: req.user.id,
      });

    if (!deleted) {
        res.status(404);
        throw new Error('Post not found or not authorized to delete');
    }
    res.status(204).send()
})

const editPost = asyncHandler( async (req, res) => {
    if (!req.user || !req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const post = await Post.findById(req.params.id)
    if(!post) {
        res.status(404);
        throw new Error('Post not found');
    }
    if (post.author.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to edit this post');
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true

    })
    res.status(200).json(updatedPost)

})


module.exports = {
    getPosts,
    createPost,
    deletePost,
    editPost
}