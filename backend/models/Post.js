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
    },

    date: {
        type: Date, 
        required: true, 
    },

    location: {
        type: String, 
        required: true
    },

    isOpenToJoin: { //determines whether or not any users have to send join requests to join trip
        type: Boolean, 
        default: false
    },

}, 
{
    timestamps: true
})

module.exports = model('Post', postSchema); 