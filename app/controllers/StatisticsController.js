const GamingSessionModel = require('../models/GamingSessionModel');
const PlayerModel = require('../models/PlayerModel');


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


module.exports = {
    getGamesPerPlayer,
};