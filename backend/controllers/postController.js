const asyncHandler = require('express-async-handler')
const Post = require('../models/Post')
const JoinRequest = require('../models/JoinRequest');
const User = require('../models/User');

const getPosts = asyncHandler(async (req, res) => {
    const {
        search,
        dateGoing,
        datePosted,
    } = req.query

    const filter = {}

    if (search) {
        const regex = new RegExp(search, 'i')
        filter.$or = [
            {cafeName: regex},
            {description: regex},
            {location: regex},
        ]
    }
    if (dateGoing) {
        const day = new Date(dateGoing)
        if(!isNaN(day)) {
            const nextDay = new Date(day)
            nextDay.setDate(nextDay.getDate() + 1)
            filter.date = {$gte: day, $lt: nextDay}
        }
    }
    if (datePosted) {
        const day = new Date(datePosted)
        if(!isNaN(day)) {
            const nextDay = new Date(day)
            nextDay.setDate(nextDay.getDate() + 1)
            filter.createdAt = {$gte: day, $lt: nextDay}
        }
    }

    console.log("Filter: ", filter )

    const posts = await Post.find(filter)
        .sort({date: 1})
        .populate('author', 'username')
    console.log("posts")

    res.status(200).json(posts)
})

const createPost = asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }
    const post = await Post.create({
        author: req.user.id,
        cafeName: req.body.cafeName,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
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

const getUserPosts = asyncHandler( async (req, res)=> {
    const userId = req.params.id
    const posts = await Post.find({author: userId})
        .sort({createdAt: -1})
        .populate('author', 'username')

    if (posts.length === 0) {
        return res.status(200).json({ message: 'No posts yet' })
    }
    return res.status(200).json(posts)
})

const getLeaderboard = asyncHandler( async (req, res) => {
    const counts = new Map()

    const addCount = (userId) => {
        const key = userId.toString()
        counts.set(key, (counts.get(key) || 0) + 1)
    }

    const posts = await Post.find({}, 'author').lean()
    posts.forEach(post => {
        addCount(post.author)
    })

    const joins = await JoinRequest.find({status: 'accepted'}, 'user').lean()
    joins.forEach(join => {
        addCount(join.user)
    })

    const userIds = [...counts.keys()]

    const users = await User.find({_id: {$in: userIds}}, 'username').lean()

    const leaderboard = userIds.map(id => {
        const user = users.find(u => u._id.toString() === id)
        return {
            _id: id,
            username: user.username,
            trips: counts.get(id)
        }
    }).sort((a, b) => b.trips - a.trips)

    return res.status(200).json(leaderboard)


})

module.exports = {
    getPosts,
    createPost,
    deletePost,
    editPost,
    getUserPosts,
    getLeaderboard
}