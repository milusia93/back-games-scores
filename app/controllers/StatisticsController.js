const GamingSessionModel = require('../models/GamingSessionModel');
const PlayerModel = require('../models/PlayerModel');


const getGamesPerPlayer = async (req, res) => {
    try {
        const sessions = await GamingSession.find().populate('players');
        const playerCounts = {};

        sessions.forEach(session => {
            session.players.forEach(player => {
                const playerName = player.name;
                playerCounts[playerName] = (playerCounts[playerName] || 0) + 1;
            });
        });

        res.json(playerCounts);
    } catch (err) {
        res.status(500).json({ error: 'Błąd podczas generowania statystyki.' });
    }
};


module.exports = {
    getGamesPerPlayer,
};