const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/GamesController')

module.exports = () => {
    //GET /games
    router.get('/', GamesController.index)

    //POST /games/add
    router.post('/add', GamesController.create)

    //DELETE /games/delete/:id
    router.delete('/delete/:id', GamesController.delete)

    //PUT/games/update/:id
    router.put('/update/:id', GamesController.update)

    //GET /games/:id
    router.get('/:id', GamesController.game)

    return router
}