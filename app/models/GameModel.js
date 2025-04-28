const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    name: {
        type: String, required: true, unique: true
    },
    minnumplayers: {
        type: Number, required: true
    },
    maxnumplayers: {
        type: Number, required: true
    },
    genres: [{
        type: String
    }],
    imageUrl: {
        type: String,
    },
 
})

module.exports = mongoose.model('Game', GameSchema)