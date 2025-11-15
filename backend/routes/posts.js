const express = require('express');

const router = express.Router();
const {    
    getPosts,
    createPost,
    deletePost,
    editPost
} = require('../controllers/userController')

router.get('/', getPosts)
router.post('/', protect, createPost)
router.patch('/:id', protect, editPost)
router.delete('/:id', protect, deletePost)


module.exports = router; 

