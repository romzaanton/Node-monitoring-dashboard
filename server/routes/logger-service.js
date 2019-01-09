const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { verifyJWToken } = require('../config/jwt/jwt-authentication');

const routes = express.Router();

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({extended: true}));
routes.use(cookieParser());


routes.use(async (req, res, next) => {
    const verified = await createFunctionProxy(verifyJWToken, this, [ req.cookies[cookieName]]);
    if (!verified) {
        res.status(401).send();
        return;
    }
    next();
});

routes.get('/performance-logs', (req, res, next) => {
    res.status(200).send('ok');
})

routes.get('/cpu-monitoring-data', (req, res, next) => {

})


module.exports = routes;