const express = require('express');
const router = express.Router();
const PlayersController = require('../controllers/PlayersController')
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
    //GET /players
    router.get('/', PlayersController.index)

    //POST /players/add
    router.post('/add', upload.single("file"), PlayersController.create)

    //DELETE /players/delete/:id
    router.delete('/delete/:id', PlayersController.delete)

    //PUT/players/update/:id
    router.put('/update/:id', PlayersController.update)

    //GET /players/:id
    router.get('/:id', PlayersController.player)

    return router
}