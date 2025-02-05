const PlayerModel = require('../models/PlayerModel');

module.exports = {
    index: (req, res) => {
       PlayerModel.find()
       .then((players) => {
        res.status(200).json({
            data: players
        })
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
            color: req.body.color
        })
        player
            .save()
            .then(() => {
                res.status(201).send(player);
            })
            .catch((err) => {
                console.log("test");
                res.status(500).json({
                    message: "Error while creating new client",
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
    }
}