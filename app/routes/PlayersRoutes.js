const express = require('express');
const router = express.Router();
const PlayersController = require('../controllers/PlayersController')

module.exports = () => {
    //GET /players
    router.get('/', PlayersController.index)

    //POST /players/add
    router.post('/add', PlayersController.create)

    //DELETE /players/delete/:id
    router.delete('/delete/:id', PlayersController.delete)

    //PUT/players/update/:id
    router.put('/update/:id', PlayersController.update)

    //GET /players/:id
    router.get('/:id', PlayersController.player)

    return router
}