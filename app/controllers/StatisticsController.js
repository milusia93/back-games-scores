const GamingSessionModel = require('../models/GamingSessionModel');
const PlayerModel = require('../models/PlayerModel');
const GameModel = require('../models/GameModel');

const getGamesPerPlayer = async (req, res) => {
    try {
        const players = await PlayerModel.find();
        const playerCounts = [];

        players.forEach(player => {
            playerCounts.push({
                player: player,
                gamesCount: player.gamesPlayed.length
            })
        });

        res.json(playerCounts);
    } catch (err) {
        res.status(500).json({ error: 'Błąd podczas generowania statystyki.' });
    }
};

const getCurrentChampionTitleCounter = async (req, res) => {
    try {
        const games = await GameModel.find();
        const titleCounts = {};


        for (const game of games) {
            const latestSession = await GamingSessionModel
                .findOne({ game: game._id, finished: true, winner: { $ne: null } })
                .sort({ date: -1 })
                .populate('winner');

            if (latestSession && latestSession.winner) {
                const winnerId = latestSession.winner._id.toString();
                titleCounts[winnerId] = (titleCounts[winnerId] || 0) + 1;
            }
        }

        const allPlayers = await PlayerModel.find();

        const ranking = allPlayers.map(player => {
            const gamesPlayed = player.gamesPlayed || [];
            const wins = gamesPlayed.filter(g => g.isWinner).length;

            return {
                playerId: player._id,
                name: player.name,
                avatarUrl: player.avatarUrl,
                color: player.color,
                championTitles: titleCounts[player._id.toString()] || 0,
                gamesCount: gamesPlayed.length,
                totalWins: wins,
            };
        });

        ranking.sort((a, b) => b.championTitles - a.championTitles);

        res.json(ranking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd podczas generowania rankingu mistrzów.' });
    }
};

module.exports = {
    getGamesPerPlayer,
    getCurrentChampionTitleCounter,
};