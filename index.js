const config = require('./config');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoUrl = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`

mongoose
    .connect(mongoUrl, {})
    .then(()=> {
        console.log('MongoDB is connected')
    })
    .catch((err)=>{
        throw err
    })

const app = express();
app.use(express.json())
app.use(cors());

app.use('/images', express.static('images'))

const PlayersRoutes = require('./app/routes/PlayersRoutes')();
app.use('/players', PlayersRoutes);

const GamesRoutes = require('./app/routes/GamesRoutes')();
app.use('/games', GamesRoutes);

const GamingSessionRoutes = require('./app/routes/GamingSessionRoutes')();
app.use('/gamingsessions', GamingSessionRoutes);

app.listen(config.app.port, () => {
    console.log('Express server is up');
});