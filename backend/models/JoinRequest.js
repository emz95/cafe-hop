const {Schema, model} = require("mongoose");

const joinRequestSchema = new Schema({
    requester: {
        type: Types.ObjectId, 
        ref: "User", 
        required: true
    },
    post: {
        type: Types.ObjectId,
        ref: "Post",
        required: true,
    },
    status: {
        type: String, 
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    poster: {
        type: Types.ObjectId, 
        ref: "User", 
        required: true
    }
}, 
{
    timestamps: true
})

module.exports = model('JoinRequest', joinRequestSchema);
