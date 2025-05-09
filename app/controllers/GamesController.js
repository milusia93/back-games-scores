const GameModel = require('../models/GameModel');
const fs = require('fs');

module.exports = {
    index: (req, res) => {
        GameModel.find()
            .then((games) => {
                res.status(200).json(games);
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while fetching games",
                    error: err,
                });
            });
    },

    create: (req, res) => {
        const game = new GameModel({
            name: req.body.name,
            minnumplayers: req.body.minnumplayers,
            maxnumplayers: req.body.maxnumplayers,
            genres: req.body.genres,
            imageUrl: req.file ? `images/${req.file.filename}` : undefined,
        });

        game
            .save()
            .then(() => {
                res.status(201).send(game);
            })
            .catch((err) => {
                if (err.code === 11000) {
                    res.status(409).json({
                        signedup: false,
                        message: "Game name already exists",
                    });
                } else {
                    res.status(500).json({
                        error: err,
                    });
                }
            });
    },

    delete: (req, res) => {
        GameModel.findByIdAndDelete(req.params.id)
            .then((deletedGame) => {
                if (deletedGame && deletedGame.imageUrl) {
                    const imagePath = `./${deletedGame.imageUrl}`;
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error("Błąd podczas usuwania pliku:", err);
                        }
                    });
                }

                if (deletedGame) {
                    res.status(200).json({ deleted: true });
                } else {
                    res.status(404).json({ err: "Game not found" });
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while deleting game",
                    error: err,
                });
            });
    },

    update: async (req, res) => {
        try {
            const updateData = {
                name: req.body.name,
                minnumplayers: req.body.minnumplayers,
                maxnumplayers: req.body.maxnumplayers,
                genres: req.body.genres,
            };

            if (req.file) {
                updateData.imageUrl = `images/${req.file.filename}`;
            }

            const prevGame = await GameModel.findById(req.params.id);
            if (!prevGame) {
                return res.status(404).json({ err: "Game not found" });
            }

            if (prevGame.imageUrl && req.file) {
                const imagePath = `./${prevGame.imageUrl}`;
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error("Błąd podczas usuwania pliku:", err);
                    }
                });
            }

            const updatedGame = await GameModel.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedGame) {
                return res.status(404).json({ err: "Game not found" });
            }

            res.status(200).send(updatedGame);
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({
                    error: "Game name already exists",
                });
            }

            res.status(500).json({
                message: "Error while updating game",
                error: err,
            });
        }
    },

    game: (req, res) => {
        GameModel.findById(req.params.id)
            .then((game) => {
                if (game) {
                    res.status(200).send(game);
                } else {
                    res.status(404).json({ err: "Game not found" });
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while fetching game",
                    error: err,
                });
            });
    },
};
