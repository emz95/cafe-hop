const express = require('express');

const router = express.Router();
const {registerUser, loginUser, userInfo, updateUser, deleteUser, refresh, getUserPosts} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, userInfo)
router.patch('/me', protect, updateUser)
router.delete('/me', protect, deleteUser)
router.get('/me/posts', protect, getUserPosts)
router.post('/refresh', refresh)




module.exports = router;
