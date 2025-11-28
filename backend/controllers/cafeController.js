const asyncHandler = require('express-async-handler');

const cafe = require('../models/Cafe');

const getCafes = asyncHandler(async (req, res) => {
    const cafes = await cafe.find({}).
    sort({name: 1}).
    lean();
    res.status(200).json(cafes);
});

const createCafe = asyncHandler(async (req, res) => {
    const Cafe = await cafe.create({
        name: req.body.name
    }); 
    res.status(201).json(Cafe);
})

const getCafeByID = asyncHandler(async (req, res) => {
    const Cafe = await cafe.findById(req.params.id).lean();
    if(!Cafe) res.status(404)
    res.status(200).json(Cafe);
})

module.exports = {
    getCafes,
    createCafe,
    getCafeByID

}