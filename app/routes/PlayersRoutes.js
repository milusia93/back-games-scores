const express = require('express');
const router = express.Router();
const PlayersController = require('../controllers/PlayersController')

module.exports = () => {
    // Get /players
    router.get('/', PlayersController.index)

    //POST /players/add
    router.post('/add', PlayersController.create)

    //DELETE /players/delete/:id
    router.delete('/delete/:id', PlayersController.delete)

    return router
}