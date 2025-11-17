const express = require('express');
const {protect} = require('../middleware/authMiddleware')

const router = express.Router();
const {    
    getPosts,
    createPost,
    deletePost,
    editPost,
    getUserPosts,
    getLeaderboard
} = require('../controllers/postController');

router.get('/', getPosts)
router.post('/', protect, createPost)
router.patch('/:id', protect, editPost)
router.delete('/:id', protect, deletePost)
router.get('/user/:id', getUserPosts )
router.get('/leaderboard', getLeaderboard)


module.exports = router; 

