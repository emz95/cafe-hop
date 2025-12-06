const {Schema, model, Types} = require("mongoose");


const joinRequestSchema = new Schema({
    requester: { //user who has sent join request to a post 
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
    poster: { //person receiving the incoming join requests
        type: Types.ObjectId, 
        ref: "User", 
        required: true
    }
}, 
{
    timestamps: true
})

module.exports = model('JoinRequest', joinRequestSchema);
