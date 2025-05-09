const express = require('express');
const router = express.Router();
const GamingSessionController = require('../controllers/GamingSessionController')


module.exports = () => {
    //GET /gamingsessions
    router.get('/', GamingSessionController.index)

    //POST /gamingsessions/add
    router.post('/add', GamingSessionController.create)

    //DELETE /gamingsessions/delete/:id
    router.delete('/delete/:id', GamingSessionController.delete)

    //PUT/gamingsessions/update/:id
    router.put('/update/:id', GamingSessionController.update)

    //GET /gamingsessions/:id
    router.get('/:id', GamingSessionController.session)

    return router
}