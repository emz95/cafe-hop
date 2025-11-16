const express = require('express');

const router = express.Router();
const {    
    getPosts,
    createPost,
    deletePost,
    editPost,
    getUserPosts,
    getLeaderboard
} = require('../controllers/userController');
const { getLeaderboard } = require('../controllers/postController');

router.get('/', getPosts)
router.post('/', protect, createPost)
router.patch('/:id', protect, editPost)
router.delete('/:id', protect, deletePost)
router.get('/user/:id', getUserPosts )
router.get('/leaderboard', getLeaderboard)

<<<<<<< HEAD
=======
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
>>>>>>> 70a5c9d (made cafe review and cafe controller)

module.exports = router; 

