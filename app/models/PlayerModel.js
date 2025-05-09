const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: {
        type: String, required: true, unique: true
    },
    email: {
        type: String, required: true, unique: true
    },
    color: {
        type: String, required: true, unique: false
    },
    avatarUrl: {
        type: String,
    },
    gamesPlayed: {
        type: String
    }
})

module.exports = mongoose.model('Player', PlayerSchema)