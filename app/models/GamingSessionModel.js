const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GamingSessionSchema = new Schema({
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    numplayers: {
      type: Number,
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    finished: {
      type: Boolean,
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  });

module.exports = mongoose.model("GamingSession", GamingSessionSchema)