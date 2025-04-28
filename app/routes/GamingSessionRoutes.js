const express = require('express');
const router = express.Router();
const GamingSessionController = require('../controllers/GamingSessionController')


module.exports = () => {
    //GET /gamingsession
    router.get('/', GamingSessionController.index)

    //POST /gamingsession/add
    router.post('/add', GamingSessionController.create)

    //DELETE /gamingsession/delete/:id
    router.delete('/delete/:id', GamingSessionController.delete)

    //PUT/gamingsession/update/:id
    router.put('/update/:id', GamingSessionController.update)

    //GET /gamingsession/:id
    router.get('/:id', GamingSessionController.session)

    return router
}