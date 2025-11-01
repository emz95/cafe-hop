const {Schema, model, Types} = require("mongoose");

const cafeSchema = new Schema({
    name: {
        type: String, 
        required: true,
    }

    })

module.exports = model('Cafe', cafeSchema);