const { Schema, model, Types } = require('mongoose');

const cafeReviewSchema = new Schema({
    cafe: {
        type: Types.ObjectId,
        ref: 'Cafe',
        required: true
    },
    reviewer: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    photos: [String]


}, {timestamps: true})

module.exports = model('CafeReview', cafeReviewSchema);