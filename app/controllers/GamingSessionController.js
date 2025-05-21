const GamingSessionModel = require('../models/GamingSessionModel')

module.exports = {
    index: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5; 
        const sortingCategory = req.query.category || 'date';
        const sortingDirection = req.query.direction || 'descending';
        const status = req.query.status; 
        const gameId = req.query.gameId;

        const sortMethods = {
            none: 1,
            ascending: 1,
            descending: -1,
        };

        let sort = {};

        if (sortingCategory === 'game.name') {
            sort = { 'game.name': sortMethods[sortingDirection] };
        } else {
            sort = { [sortingCategory]: sortMethods[sortingDirection] };
        }

        const startIndex = (page - 1) * limit;

        const query = {};
        if (status === "finished") {
            query.finished = true;
        } else if (status === "ongoing") {
            query.finished = false;
        }
    
        if (gameId) {
            query.game = gameId;
        }

        const total = await GamingSessionModel.countDocuments();

        GamingSessionModel.find(query)
            .skip(startIndex)
            .limit(limit)
            .sort(sort)
            .populate('game')
            .populate('players')
            .populate('winner')
            .then((sessions) => {
                res.status(200).json({
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                    data: sessions,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "error while fetching sessions",
                    error: err
                });
            });
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
                res.status(500).json({
                    message: "Error while creating new session",
                    error: err,
                });
            });
    },

    delete: (req, res) => {
        GamingSessionModel.findByIdAndDelete(req.params.id)
            .then((deletedsession) => {
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
