const {Schema, model, Types} = require("mongoose");


const messageSchema = new Schema({

    sender: {
        type: Types.ObjectId, 
        ref: "User", 
        required: true,
    },
    group: { //the group chat this message belongs to 
        type: Types.ObjectId, 
        ref: "GroupChat", 
        required: true, 
    },
    text: {
        type: String, 
        required: true, 
    }

}, 

{
    timestamps: true
})

module.exports = model('Message', messageSchema);