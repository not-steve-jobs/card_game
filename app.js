require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const { logger } = require('./utils/logger');
const routes = require('./routes/routes');


const PORT = process.env.PORT ?? 5000;

const app = express();

require("./mongo/mongo");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', '*');
    next();
});

logger.info("APP START ----------");

app.use('/api', routes);

app.use('*', (req, res) => {
    logger.error(`APP INVALID ROUTE ${req.originalUrl}`);
    res.status(404).json({
        message:`APP INVALID ROUTE  ${req.originalUrl}`
    });
});

app.listen(PORT, async () => {
    logger.info(`Server has been started on port ${PORT}`);
});