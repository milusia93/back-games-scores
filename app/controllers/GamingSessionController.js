const GamingSessionModel = require('../models/GamingSessionModel')

module.exports = {
    index: (req, res) => {
        GamingSessionModel.find()
            .then((sessions) => {
                res.status(200).json({
                    data: sessions
                })
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "error while fetching sessions",
                    error: err
                })
            })
    },

    create: (req, res) => {
        const session = new GamingSessionModel({
            game: req.body.game,
            numplayers: req.body.numplayers,
            players: req.body.players,
            date: req.body.date,
            finished: req.body.finished,
            winner: req.body.winner
        })
        session
            .save()
            .then(() => {
                res.status(201).send(session);
            })
            .catch((err) => {
                console.log("test");
                res.status(500).json({
                    message: "Error while creating new session",
                    error: err,
                });
            });
    },

    delete: (req, res) => {
        GamingSessionModel.findByIdAndDelete(req.params.id)
            .then((deletedsession) => {
                console.log(deletedsession);
                if (deletedsession) {
                    res.status(200).json({ deleted: true })
                } else {
                    res.status(404).json({ err: "not found" })
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while deleting session",
                    error: err,
                });
            })
    },

    update: (req, res) => {
        GamingSessionModel.findByIdAndUpdate(req.params.id,
            {
                game: req.body.game,
                numplayers: req.body.numplayers,
                players: req.body.players,
                date: req.body.date,
                finished: req.body.finished,
                winner: req.body.winner
            },
            { new: true }
        )
            .then((updatedsession) => {
                console.log(updatedsession);
                if (updatedsession) {
                    res.status(201).send(updatedsession)
                } else {
                    res.status(404).json({ err: "not found" })
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while updating session",
                    error: err,
                });
            })
    },

    session: (req, res) => {
        GamingSessionModel.findById(req.params.id)
            .then((session) => {
                console.log(session);
                if (session) {
                    res.status(200).send(session)
                } else {
                    res.status(404).json({ err: "not found" })
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while fetching session",
                    error: err,
                });
            })
    }
}
