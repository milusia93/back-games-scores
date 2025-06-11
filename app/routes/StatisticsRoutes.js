const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/StatisticsController')


module.exports = () => {

    //GET /statistics/games_per_player
    router.get('/games_per_player', StatisticsController.getGamesPerPlayer);


    return router
}