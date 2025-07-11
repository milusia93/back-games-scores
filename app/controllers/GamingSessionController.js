const GamingSessionModel = require("../models/GamingSessionModel");
const PlayerModel = require("../models/PlayerModel");

module.exports = {
  index: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const sortingCategory = req.query.category || "date";
      const sortingDirection = req.query.direction || "descending";
      const status = req.query.status;
      const gameId = req.query.gameId;

      const sortMethods = {
        none: 1,
        ascending: 1,
        descending: -1,
      };

      let sort = {};
      if (sortingCategory === "game.name") {
        sort = { "game.name": sortMethods[sortingDirection] };
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

      const total = await GamingSessionModel.countDocuments(query);
      const sessions = await GamingSessionModel.find(query)
        .skip(startIndex)
        .limit(limit)
        .sort(sort)
        .populate("game")
        .populate("players")
        .populate("winner");

      res.status(200).json({
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: sessions,
      });
    } catch (err) {
      res.status(500).json({
        message: "error while fetching sessions",
        error: err,
      });
    }
  },

  create: async (req, res) => {
    try {
      const { game, numplayers, players, date, finished, time, winner } = req.body;

      if (!game || !numplayers || !players || !date || finished === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (players.length !== numplayers) {
        return res.status(400).json({
          message: "Number of players does not match numplayers",
        });
      }

      const session = new GamingSessionModel({
        game,
        numplayers,
        players,
        date,
        finished,
        time,
        winner,
      });

      const saved = await session.save();

      if (finished) {
        const updates = players.map((p) => {
          const playerId = p._id || p;
          const isWinner = playerId.toString() === winner?.toString();

          return PlayerModel.updateOne(
            { _id: playerId },
            {
              $addToSet: {
                gamesPlayed: {
                  sessionId: saved._id,
                  isWinner,
                },
              },
            }
          );
        });

        await Promise.all(updates);
      }

      res.status(201).send(saved);
    } catch (err) {
      res.status(500).json({
        message: "Error while creating new session",
        error: err,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const deletedSession = await GamingSessionModel.findByIdAndDelete(req.params.id);

      if (!deletedSession) {
        return res.status(404).json({ err: "not found" });
      }

      // Pobieramy ID graczy, którzy uczestniczyli w tej sesji
      const playerIds = deletedSession.players.map(p => p._id || p);

      // Usuwamy dane o sesji z pola gamesPlayed tylko u tych graczy
      await Promise.all(
        playerIds.map(playerId =>
          PlayerModel.updateOne(
            { _id: playerId },
            {
              $pull: {
                gamesPlayed: { sessionId: deletedSession._id },
              },
            }
          )
        )
      );

      res.status(200).json({ deleted: true });
    } catch (err) {
      res.status(500).json({
        message: "Error while deleting session",
        error: err,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { game, numplayers, players, date, finished, time, winner } = req.body;

      if (!game || !numplayers || !players || !date || finished === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (players.length !== numplayers) {
        return res.status(400).json({
          message: "Number of players does not match numplayers",
        });
      }


      // Pobierz poprzednią wersję sesji
      const previousSession = await GamingSessionModel.findById(req.params.id);

      if (!previousSession) {
        return res.status(404).json({ err: "Session not found" });
      }

      // Zaktualizuj sesję
      const updatedSession = await GamingSessionModel.findByIdAndUpdate(
        req.params.id,
        { game, numplayers, players, date, finished, time, winner },
        { new: true }
      );

      const oldPlayerIds = previousSession.players.map(p => p._id?.toString() || p.toString());
      const newPlayerIds = players.map(p => p._id?.toString() || p.toString());

      const allRelevantPlayerIds = Array.from(new Set([...oldPlayerIds, ...newPlayerIds]));

      // Usuń starą informację o tej sesji ze wszystkich powiązanych graczy
      await Promise.all(
        allRelevantPlayerIds.map((id) =>
          PlayerModel.updateOne(
            { _id: id },
            {
              $pull: {
                gamesPlayed: { sessionId: updatedSession._id },
              },
            }
          )
        )
      );

      // Jeśli sesja jest teraz zakończona – dodaj nowe dane
      if (finished) {
        const updates = newPlayerIds.map((id) => {
          const isWinner = id.toString() === winner?.toString();

          return PlayerModel.updateOne(
            { _id: id },
            {
              $addToSet: {
                gamesPlayed: {
                  sessionId: updatedSession._id,
                  isWinner,
                },
              },
            }
          );
        });

        await Promise.all(updates);
      }

      res.status(201).json(updatedSession);
    } catch (err) {
      res.status(500).json({
        message: "Error while updating session",
        error: err,
      });
    }
  },

  session: async (req, res) => {
    try {
      const session = await GamingSessionModel.findById(req.params.id)
        .populate("game")
        .populate("players")
        .populate("winner");

      if (session) {
        res.status(200).send(session);
      } else {
        res.status(404).json({ err: "not found" });
      }
    } catch (err) {
      res.status(500).json({
        message: "Error while fetching session",
        error: err,
      });
    }
  },
};