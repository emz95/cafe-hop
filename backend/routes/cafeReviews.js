const express = require('express');

const { createReview, getReviewsByCafe, deleteReview } = require('../controllers/cafeReviewController');

const { protect } = require('../middleware/authMiddleware');
const { getCafes } = require('../controllers/cafeController');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/', protect, getCafes)
router.get('/byCafe/:cafeId', protect, getReviewsByCafe);
router.delete('/:id', protect, deleteReview);

module.exports = router; 




// router.post('/', async (req, res) => {
//     try {
//         const review = await CafeReview.create(req.body);
//         res.status(201).json(review);

//     }
//     catch (error) {
//         res.status(400).json({error: "could not make review"});
//     }
// });

// router.get('/byCafe/:cafeId', async (req, res) => {
//     try {
//         const reviews = await CafeReview.find({cafe: req.params.cafeId}).
//         select('reviewer rating photos createdAt').
//         populate('reviewer', 'username _id').
//         sort({createdAt: -1}).
//         lean();
//         res.json(reviews);

//     }
//     catch (error) {
//         res.status(400).json({error: "could not find reviews for this cafe"});
//     }

// });

// router.delete('/:id',async (req, res) => {
//     try {
//         const review = await CafeReview.findByIdAndDelete(req.params.id);
//         if(!review) {
//             return res.status(404).json({error: "review not found"});
//         }
//         res.json({message: "review deleted"});
//     }
//     catch (error) {
//         res.status(400).json({error: "could not delete"})
//     }


// });

// module.exports = router; 