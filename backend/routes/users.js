const express = require('express');

const User = require('../models/User');

const router = express.Router();
const {registerUser, loginUser, userInfo} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/info', protect, userInfo)


//delete by userID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({error: 'User not found'});
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

});

/*

//update user data
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user) return res.status(404).json({error: 'User not found'});
        res.json({ message: 'User updated', data: user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
*/

module.exports = router;
