const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const registerUser = asyncHandler(async (req, res) => {
    const {username, firstName, lastName, email, password, number } = req.body
    if (!username || !firstName || !lastName || !email || !password) {
        res.status(400);
        throw new Error('Please include all required fields');
    }

    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // check username for dupes?

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create user
    const user = await User.create({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        number
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

const userInfo = asyncHandler(async (req, res) => {
    const {_id } = await User.findById(req.user.id)

    res.status(200).json({
        id:_id
    })
})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:'30d'})
}

module.exports = {
    registerUser,
    loginUser,
    userInfo,
}