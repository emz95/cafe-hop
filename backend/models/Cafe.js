const {Schema, model, Types} = require("mongoose");

const cafeSchema = new Schema({
    name: {
        type: String, 
        required: true,
        unique: true 
    },

    imageUrl: String,

    avgRating: {
        type: Number, 
        default: 0
    },
    reviewCount: {
        type: Number, 
        default: 0
    }

    })

module.exports = model('Cafe', cafeSchema);