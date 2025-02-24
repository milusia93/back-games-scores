const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    name: {
        type: String, required: true, unique: true
    },
    numplayers: {
        type: Number, required: true
    },
    genres: [{
        type: String
    }]
})

module.exports = mongoose.model('Game', GameSchema)