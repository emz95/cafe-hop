const {Schema, model, Types} = require("mongoose");


const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true
    }, 
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        match: /@ucla\.edu$/i
    },
    number: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    bio: String,
    socials: String,
    profilePictureUrl: String
},
{
    timestamps: true
})

module.exports = model('User', userSchema);