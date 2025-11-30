const {Schema, model, Types} = require("mongoose");


const groupChatSchema = new Schema({

    chatName: {
        type: String,
        required: true, 
        default: "chat with x y and z (names)"
    },

    members: [{
        type: Types.ObjectId,
        ref: "User",
        required: true,  
    }],
    post: {
        type: Types.ObjectId, 
        ref: "Post",
        required: true, 

        unique: true
    },
    postAuthor: {
        type: Types.ObjectId, 
        ref: "User",
        required: true,
    },
},
    {
    timestamps: true,           
    }
);

module.exports = model('GroupChat', groupChatSchema);