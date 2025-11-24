const asyncHandler = require('express-async-handler');

const cafeReview = require('../models/CafeReview');

const getCafes = asyncHandler(async (req, res) => {
    const cafes = await cafeReview.find()
    res.status(200).json(cafes)
})

const createReview = asyncHandler(async (req, res) => {
    const review = await cafeReview.create({
        cafe: req.body.cafe,
        reviewer: req.user._id,
        rating: req.body.rating,
        photos: req.body.photos

    });
    res.status(201).json(review);

});

const getReviewsByCafe = asyncHandler(async (req, res) => {
    const reviews = await cafeReview.find({cafe: req.params.cafeId}).
    select('reviewer rating photos createdAt').
    populate('reviewer', 'username _id profilePictureUrl').
    sort({createdAt: -1}).
    lean();
    res.json(reviews);
});

const deleteReview = asyncHandler(async (req, res) => {
    const review = await cafeReview.findByIdAndDelete(req.params.id);
    if(!review) {
        return res.json({error: "could not delete review"});
    }
    return res.json({message: "review deleted"});
    
});

module.exports = {
    createReview,
    getReviewsByCafe,
    deleteReview,
    getCafes
};