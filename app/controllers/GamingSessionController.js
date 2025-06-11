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

    create: async (req, res) => {
        const { game, numplayers, players, date, finished, winner } = req.body;

        if (!game || !numplayers || !players || !date || finished === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (players.length !== numplayers) {
            return res.status(400).json({ message: "Number of players does not match numplayers" });
        }

        const session = new GamingSessionModel({
            game,
            numplayers,
            players,
            date,
            finished,
            winner
        });

        try {
            const saved = await session.save();
            res.status(201).send(saved);
        } catch (err) {
            res.status(500).json({
                message: "Error while creating new session",
                error: err,
            });
        }
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
        const { game, numplayers, players, date, finished, winner } = req.body;

        if (!game || !numplayers || !players || !date || finished === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (players.length !== numplayers) {
            return res.status(400).json({ message: "Number of players does not match numplayers" });
        }

        GamingSessionModel.findByIdAndUpdate(
            req.params.id,
            {
                game,
                numplayers,
                players,
                date,
                finished,
                winner,
            },
            { new: true }
        )
            .populate('game')
            .populate('players')
            .populate('winner')
            .then((updatedsession) => {
                if (updatedsession) {
                    res.status(201).send(updatedsession);
                } else {
                    res.status(404).json({ err: "not found" });
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: "Error while updating session",
                    error: err,
                });
            });
    },

    session: (req, res) => {
        GamingSessionModel.findById(req.params.id)
            .populate('game')
            .populate('players')
            .populate('winner')
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
