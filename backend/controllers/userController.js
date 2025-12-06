const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Post = require('../models/Post')

const registerUser = asyncHandler(async (req, res) => {
    //check for required fields
    const {username, firstName, lastName, email, password, number } = req.body
    if (!username || !firstName || !lastName || !email || !password) {
        res.status(400).json({
            message: 'Please include all required fields',
        })
    }

    //check for username
    const usernameExists = await User.findOne({username})
    if(usernameExists) {
        return res.status(400).json({
            message: 'Username is taken', 
        })
    }

    //check for ucla email
    if (!/@ucla\.edu$/i.test(email)) {
        return res.status(400).json({
          message: 'Email must be a @ucla.edu address',
        })
    }

    //check for user
    const userExists = await User.findOne({email})
    if(userExists) {
        return res.status(400).json({
            message: 'Email already exists',
        })
    }
    
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
        return sendAuthRes(user, res, 201)
    } else {
        return res.status(400).json({
            message: 'Invalid user data'
        })
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    return sendAuthRes(user, res, 200);
  });
  

const userInfo = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')

    if(!user) {
        res.status(404)
        throw new Error('User not found')
    }

    res.status(200).json(user)
})

const getUserPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ author: req.user.id })
        .sort({ createdAt: -1 });
    res.json(posts)
})

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    
    if(!user) {
        res.status(404)
        throw new Error('User not found')
    }
    
    res.status(200).json(user)
})


//for when user updates bio or profile 
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
    }).select('-password')

    if(!user) {
        res.status(404)
        throw new Error('User not found')
    }

    res.json(user)
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user.id)

    if(!user) {
        res.status(404)
        throw new Error('User not found')
    }

    res.status(204).send() 

})

const generateAccessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
}
const generateRefreshToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:'7d'})
}

const sendAuthRes = (user, res, statusCode) => {
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000
    })

    return res.status(statusCode).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: accessToken,
    })

}

const refresh = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken
    if (!token) {
        res.status(401)
        throw new Error('No refresh token')
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if(!user) {
            res.status(401)
            throw new Error('User not foudn')
        }
        const accessToken = generateAccessToken(user._id)
        return res.status(200).json({token: accessToken})
    } catch (err) {
        res.status(401)
        throw new Error('Invalid refresh token')
    }
})



module.exports = {
    registerUser,
    loginUser,
    userInfo,
    updateUser,
    refresh,
    deleteUser,
    getUserPosts,
    getUserById
}