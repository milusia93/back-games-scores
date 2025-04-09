const PlayerModel = require('../models/PlayerModel');

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
                            message: {
                                name: [
                                    "Username has already been taken"
                                ]
                            }
                        })
                    } else if (err.keyPattern.email === 1) {
                        res.status(409).json({
                            signedup: false,
                            message: {
                                email: [
                                    "Email has already been taken"
                                ]
                            }
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
                console.log(deletedPlayer);

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
                return res.status(500).json({
                    message: "Error while deleting player",
                    error: err,
                });
            });
    },

    // update: (req, res) => {
    //     PlayerModel.findByIdAndUpdate(req.params.id,
    //         {
    //             name: req.body.name,
    //             email: req.body.email,
    //             color: req.body.color,
    //             avatarUrl: req.file ? `images/${req.file.filename}` : undefined,
    //             gamesPlayed: req.body.gamesPlayed
    //         },
    //         { new: true }
    //     )
    //         .then((updatedPlayer) => {
    //             console.log(updatedPlayer);
    //             if (updatedPlayer) {
    //                 res.status(200).send(updatedPlayer)
    //             } else {
    //                 res.status(404).json({ err: "not found" })
    //             }
    //         })
    //         .catch((err) => {
    //             return res.status(500).json({
    //                 message: "Error while updating player",
    //                 error: err,
    //             });
    //         })
    // },
    update: async (req, res) => {
        try {
            const updateData = {
                name: req.body.name,
                email: req.body.email,
                color: req.body.color,
                gamesPlayed: req.body.gamesPlayed,
            };

            // Tylko jeśli nowy plik został przesłany, zmień `avatarUrl`
            if (req.file) {
                updateData.avatarUrl = `images/${req.file.filename}`;
            }

            const prevPlayerData = await PlayerModel.findById(req.params.id);
            if (prevPlayerData.avatarUrl && req.file) {
                const imagePath = `./${prevPlayerData.avatarUrl}`;
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
                { new: true }
            );

            if (updatedPlayer) {
                res.status(200).send(updatedPlayer);
            } else {
                res.status(404).json({ err: "not found" });
            }
        } catch (err) {
            res
                .status(500)
                .json({ message: "Error while updating player", error: err });
        }
    },

    player: (req, res) => {
        PlayerModel.findById(req.params.id)
            .then((player) => {
                console.log(player);
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