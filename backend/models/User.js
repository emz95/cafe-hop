const {Schema, model, Types} = require("mongoose");


const userSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        match: /@ucla\.edu$/i

    },
    bio: String,
    socials: String,
    profilePictureUrl: String

})

module.exports = model('User', userSchema);