const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/StatisticsController')


module.exports = () => {

    //GET /statistics/games_per_player
    router.get('/games_per_player', StatisticsController.getGamesPerPlayer);
    //GET /statistics/current_champion_title_counter
    router.get('/current_champion_title_counter', StatisticsController.getCurrentChampionTitleCounter);


    return router
}