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
                console.log("test");
                res.status(500).json({
                    message: "Error while creating new player",
                    error: err,
                });
            });
    },

    delete: (req, res) => {
        PlayerModel.findByIdAndDelete(req.params.id)
            .then((deletedPlayer) => {
                console.log(deletedPlayer);
                if (deletedPlayer) {
                    res.status(200).json({ deleted: true })
                } else {
                    res.status(404).json({ err: "not found" })
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while deleting player",
                    error: err,
                });
            })
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
                gamesPlayed: req.body.gamesPlayed
            };
    
            // Tylko jeśli nowy plik został przesłany, zmień `avatarUrl`
            if (req.file) {
                updateData.avatarUrl = `images/${req.file.filename}`;
            }
            console.log(req.params.id, updateData)
            const updatedPlayer = await PlayerModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
            if (updatedPlayer) {
                res.status(200).send(updatedPlayer);
            } else {
                res.status(404).json({ err: "not found" });
            }
        } catch (err) {
            res.status(500).json({ message: "Error while updating player", error: err });
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