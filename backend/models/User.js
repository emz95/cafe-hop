const {Schema, model} = require("mongoose");

const userSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true

    },
    number: {
        type: String
    },

})

module.exports = model('User', userSchema);