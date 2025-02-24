const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GamingSessionSchema = new Schema({
    game: {
        type: String, required: true
    },
    numplayers: {
        type: Number, required: true
    },
    players: [{
        type: String, required: true
    }],
    date: {
        type: Date, required: true 
    },
    finished: {
        type: Boolean, required: true 
    },
    winner: {
        type: String, required: false
    }
})

module.exports = mongoose.model("GamingSession", GamingSessionSchema)