const GameModel = require('../models/GameModel')

module.exports = {
    index: (req, res) => {
        GameModel.find()
            .then((games) => {
                res.status(200).json(games)
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "error while fetching games",
                    error: err
                })
            })
    },

    create: (req, res) => {
        const game = new GameModel({
            name: req.body.name,
            numplayers: req.body.numplayers,
            genres: req.body.genres,
            imageUrl: req.file ? `images/${req.file.filename}` : undefined,
        })
        game
            .save()
            .then(() => {
                res.status(201).send(game);
            })
            .catch((err) => {
                console.log("test");
                res.status(500).json({
                    message: "Error while creating new game",
                    error: err,
                });
            });
    },
    delete: (req, res) => {
        GameModel.findByIdAndDelete(req.params.id)
            .then((deletedGame) => {
                console.log(deletedGame);
                if (deletedGame) {
                    res.status(200).json({ deleted: true })
                } else {
                    res.status(404).json({ err: "not found" })
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while deleting game",
                    error: err,
                });
            })
    },

    update: (req, res) => {
        GameModel.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                numplayers: req.body.numplayers,
                genres: req.body.genres,
                imageUrl: req.file ? `images/${req.file.filename}` : undefined
            },
            { new: true }
        )
            .then((updatedGame) => {
                console.log(updatedGame);
                if (updatedGame) {
                    res.status(201).send(updatedGame)
                } else {
                    res.status(404).json({ err: "not found" })
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while updating game",
                    error: err,
                });
            })
    },

    game: (req, res) => {
        GameModel.findById(req.params.id)
            .then((game) => {
                console.log(game);
                if (game) {
                    res.status(200).send(game)
                } else {
                    res.status(404).json({ err: "not found" })
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while fetching game",
                    error: err,
                });
            })
    }
}