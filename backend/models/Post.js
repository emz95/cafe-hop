const {Schema, model, Types} = require("mongoose");

const postSchema = new Schema({

    author: {
        type: Types.ObjectId,
        required: true,
        ref: "User",
    },

    cafeName: {
        type: String, 
        required: true
    },

    description: {
        type: String,
        required: true,

    },

    date: {
        type: Date, 
        required: true, 
    },

    location: {
        type: String, 
        required: true
    },

    isOpenToJoin: {
        type: Boolean, 
        default: false
    },

}, 
{
    timestamps: true
})

module.exports = model('Post', postSchema); 