require('dotenv').config();

const express = require('express');
const { logger } = require('./utils/logger');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes');
const path = require('path');

const PORT = process.env.PORT ?? 5000;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// next line is the money
app.set('socketio', io);
app.use(cors());

//mongo connection
require("./mongo/mongo");

// app.set('views', './views/')
app.set('views', path.join(__dirname, '/views/'))
app.set('view engine', 'ejs')

app.use(express.static("./public"))

//body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', '*');
    next();
});

logger.info("APP START ----------");
app.use('/', routes);

app.use('*', (req, res) => {
    logger.error(`APP INVALID ROUTE ${req.originalUrl}`);
    res.status(404).json({
        message:`APP INVALID ROUTE  ${req.originalUrl}`
    });
});

server.listen(PORT, async () => {
    logger.info(`Server has been started on port ${PORT}`);
});