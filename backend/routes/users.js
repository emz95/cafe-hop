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

//get by userID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if(!user) {
            return res.status(404).json({error: 'User not found'})
        }
        res.json(user);

    } catch (err) {
        res.status(400).json({error: err.message})
    }
})

//delete by userID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id) 
        if (!user) return res.status(404).json({error: 'User not found'})
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }

});

//update user data
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user) return res.status(404).json({error: 'User not found'})
        res.json({ message: 'User updated', data: user })
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
