'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = express.Router();
const { createJWToken, cookieName, verifyJWToken } = require('../config/jwt/jwt-authentication');
const { saveUserToDb } = require('../mongo/mongo-create-record');
const { findUser } = require('../mongo/mongo-read-record');
const { validateHashedDataAsync } = require('../helpers/data-hashing');
const { addHttpPerformanceTracker } = require('../logger/master-service');
const { createFunctionProxy } = require('../logger/function-proxy');

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({extended: true}));
routes.use(cookieParser());

routes.use(addHttpPerformanceTracker);

routes.post('/create-new-account', async (req, res, next) => {
    try {
        const user = await findUser(req.body);
        if (user !== null) {
            res.status(200)
            .header('Content-Type', 'application/json')
            .send(createResponseBody(200, 'User exists'));
        } else {
            const recordCount = await saveUserToDb(req.body);
            const token = createJWToken();
            res.status(201).cookie(cookieName, token, {
                domain: 'localhost',
                expires: new Date(Date.now() + 60000 * 60 * 24),
                httpOnly: true,
                secure: true
            })
            .header('Content-Type', 'application/json')
            .send(createResponseBody(201, 'User created'));
        }
    } catch (error) {
        res.status(500).send(`Internal fail`);
    }
});

routes.post('/authorize', async (req, res, next) => {
    const verified = await createFunctionProxy(verifyJWToken, this, [ req.cookies[cookieName]]);
    if (verified) {
        res.status(200)
        .header('Content-Type', 'application/json')
        .send(createResponseBody(200, 'Token verified'));
        return;
    }
    const user = await findUser(req.body);
    if (user === null) {
        res.status(403)
        .header('Content-Type', 'application/json')
        .send(createResponseBody(403, 'User not found'));
        return;
    }
    const passwordIsValid = await validateHashedDataAsync(req.body.password, user.password);
    if (!verified && user !== null && passwordIsValid) {
        const token = createJWToken();
        res.status(200).cookie(cookieName, token, {
            domain: 'localhost',
            expires: new Date(Date.now() + 60000 * 60 * 2),
            httpOnly: true,
            secure: true
        })
        .send(createResponseBody(200, 'Password verified'));
        return;
    }
    if (!verified && user !== null && !passwordIsValid) {
        res.status(401)
        .header('Content-Type', 'application/json')
        .send(createResponseBody(401, 'Password invalid'));
        return;
    }
});

function createResponseBody(status, message) {
    return {
        userCreated: status === 201,
        userExist: status === 200,
        passwordVerified: status === 200,
        tokenVerified: status === 200,
        message: message,
    }   
}

function logRequest(req){
    console.log(req.headers);
    console.log(req.body);
}

module.exports = routes;