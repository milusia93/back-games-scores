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
    gamesPlayed: [
        {
            sessionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "GamingSession",
            },
            isWinner: {
                type: Boolean,
                required: true
            }
        }
    ],
})

module.exports = mongoose.model('Player', PlayerSchema)

/* gamesPlayed: [{sessionId: 'jakieś id', isWinner: true}] */

/*  gamesPlayed: [
    {
        sessionId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GamingSession",
        },
        isWinner: true
    }
  ], */