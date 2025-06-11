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
        const { name, minnumplayers, maxnumplayers, genres } = req.body;
        const imageUrl = req.file ? `images/${req.file.filename}` : undefined;

        if (!name || !minnumplayers || !maxnumplayers || minnumplayers < 1) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (maxnumplayers < 1 || minnumplayers < 1) {
            return res.status(400).json({ message: "Minimum number of players must be at least 1" });
        }

        if (maxnumplayers < minnumplayers) {
            return res.status(400).json({ message: "Maximum number of players must be greater or equal to minimum" });
        }

        const game = new GameModel({
            name,
            minnumplayers,
            maxnumplayers,
            genres,
            imageUrl,
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
        const { name, minnumplayers, maxnumplayers, genres } = req.body;

    
        if (!name || !minnumplayers || !maxnumplayers) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (minnumplayers < 1) {
            return res.status(400).json({ message: "Minimum number of players must be at least 1" });
        }
        if (maxnumplayers < minnumplayers) {
            return res.status(400).json({ message: "Maximum number of players must be greater or equal to minimum" });
        }

        const updateData = { name, minnumplayers, maxnumplayers, genres };

        if (req.file) {
            updateData.imageUrl = `images/${req.file.filename}`;
        }

        const prevGame = await GameModel.findById(req.params.id);
        if (!prevGame) {
            return res.status(404).json({ err: "Game not found" });
        }

        if (prevGame.imageUrl && req.file) {
            const imagePath = `./${prevGame.imageUrl}`;
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                console.error("Error removing old image file:", err);
            }
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
