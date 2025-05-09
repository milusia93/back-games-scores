const PlayerModel = require('../models/PlayerModel');
const fs = require('fs')

module.exports = {
    index: (req, res) => {
        PlayerModel.find()
            .then((players) => {
                res.status(200).json(players)
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "error while fetching players",
                    error: err
                })
            })
    },

    create: (req, res) => {
        const player = new PlayerModel({
            name: req.body.name,
            email: req.body.email,
            color: req.body.color,
            avatarUrl: req.file ? `images/${req.file.filename}` : undefined,
            gamesPlayed: req.body.gamesPlayed
        })
        player
            .save()
            .then(() => {
                res.status(201).send(player);
            })
            .catch((err) => {

                if (err.code === 11000) {
                    if (err.keyPattern.name === 1) {
                        res.status(409).json({
                            signedup: false,
                            message: "Username has already been taken"
                        })
                    } else if (err.keyPattern.email === 1) {
                        res.status(409).json({
                            signedup: false,
                            message: "Email has already been taken"
                        })
                    }
                } else {
                    res.status(500).json({
                        error: err
                    })
                }
            });
    },

    delete: (req, res) => {
        PlayerModel.findByIdAndDelete(req.params.id)
            .then((deletedPlayer) => {
                if (deletedPlayer.avatarUrl) {
                    const imagePath = `./${deletedPlayer.avatarUrl}`;
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error("Błąd podczas usuwania pliku:", err);
                        } else {
                            console.log("Usunięto plik:", imagePath);
                        }
                    });
                }

                if (deletedPlayer) {
                    res.status(200).json({ deleted: true });
                } else {
                    res.status(404).json({ err: "not found" });
                }
            })
            .catch((err) => {
                return res.status(409).json({
                    message: "Error while deleting player",
                    error: err,
                });
            });
    },

    update: async (req, res) => {
        try {
            const updateData = {
                name: req.body.name,
                email: req.body.email,
                color: req.body.color,
                gamesPlayed: req.body.gamesPlayed,
            };

            if (req.file) {
                updateData.avatarUrl = `images/${req.file.filename}`;
            }

            const prevPlayer = await PlayerModel.findById(req.params.id);
            if (!prevPlayer) {
                return res.status(404).json({ err: "not found" });
            }

            if (prevPlayer.avatarUrl && req.file) {
                const imagePath = `./${prevPlayer.avatarUrl}`;
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error("Błąd podczas usuwania pliku:", err);
                    } else {
                        console.log("Usunięto plik:", imagePath);
                    }
                });
            }

            const updatedPlayer = await PlayerModel.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedPlayer) {
                return res.status(404).json({ err: "not found" });
            }

            res.status(200).send(updatedPlayer);
        } catch (err) {
            if (err.code === 11000) {
                if (err.keyPattern?.name === 1) {
                    return res.status(409).json({
                        signedup: false,
                        message: "Username has already been taken"
                    });
                } else if (err.keyPattern?.email === 1) {
                    return res.status(409).json({
                        signedup: false,
                        message: "Email has already been taken"
                    });
                }
            }

            res.status(500).json({
                message: "Error while updating player",
                error: err
            });
        }
    },

    player: (req, res) => {
        PlayerModel.findById(req.params.id)
            .then((player) => {
                if (player) {
                    res.status(200).send(player)
                } else {
                    res.status(404).json({ err: "not found" })
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while fetching player",
                    error: err,
                });
            })
    }
}