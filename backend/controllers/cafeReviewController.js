const asyncHandler = require('express-async-handler');

const cafeReview = require('../models/CafeReview');
const Cafe = require('../models/Cafe');


//retrieves all Cafes in the database
const getCafes = asyncHandler(async (req, res) => {
    const cafes = await Cafe.find()
    res.status(200).json(cafes)
})
//create a cafe review for a selected cafe
const createReview = asyncHandler(async (req, res) => {
    const review = await cafeReview.create({
        cafe: req.body.cafe,
        reviewer: req.user._id,
        description: req.body.description,
        rating: req.body.rating,
        photos: req.body.photos

    });
    await review.populate('reviewer', 'username _id profilePictureUrl');

    await Cafe.calcAvgRating(review.cafe);
    res.status(201).json(review);

});


//retrieve all reviews for a specific cafe
const getReviewsByCafe = asyncHandler(async (req, res) => {
    const reviews = await cafeReview.find({cafe: req.params.cafeId}).
    select('reviewer rating photos description createdAt'). //populates all necessary fields for frontend
    populate('reviewer', 'username _id profilePictureUrl').
    sort({createdAt: -1}).
    lean();
    res.json(reviews);
});

const updateReview = asyncHandler(async (req, res) => {
    const review = await cafeReview.findById(req.params.id);
    
    if(!review) {
        res.status(404);
        throw new Error('Review not found');
    }
    
    // Check if user is the reviewer
    if(review.reviewer.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this review');
    }
    
    const updatedReview = await cafeReview.findByIdAndUpdate(
        req.params.id,
        {
            rating: req.body.rating,
            description: req.body.description,
            photos: req.body.photos
        },
        { new: true, runValidators: true }
    ).populate('reviewer', 'username _id profilePictureUrl');
    
    await Cafe.calcAvgRating(review.cafe);
    res.json(updatedReview);
});

const deleteReview = asyncHandler(async (req, res) => {
    const review = await cafeReview.findByIdAndDelete(req.params.id);
    if(!review) {
        return res.json({error: "could not delete review"});
    }
    await Cafe.calcAvgRating(review.cafe);
    return res.json({message: "review deleted"});
    
});

module.exports = {
    createReview,
    getReviewsByCafe,
    updateReview,
    deleteReview,
    getCafes
};