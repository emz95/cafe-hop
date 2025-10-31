const {Schema, model} = require("mongoose");

const UserSchema = new Schema ({
    name: {type: String},
    email: {type: String},
    number: {type: String},
    
})