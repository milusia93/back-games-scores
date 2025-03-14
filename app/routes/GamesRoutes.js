const express = require('express');
const router = express.Router();
const GamesController = require('../controllers/GamesController')
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const extArray = file.mimetype.split("/");
    const extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});

const upload = multer({ storage: storage });

module.exports = () => {
    //GET /games
    router.get('/', GamesController.index)

    //POST /games/add
    router.post('/add', upload.single("file"), GamesController.create)

    //DELETE /games/delete/:id
    router.delete('/delete/:id', GamesController.delete)

    //PUT/games/update/:id
    router.put('/update/:id', GamesController.update)

    //GET /games/:id
    router.get('/:id', GamesController.game)

    return router
}