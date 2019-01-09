'use strict'
const https = require('https');
const http2 = require('http2');
const { httpsConfig } = require('./config/config');


function createHttpsServer(app) {
    return https.createServer(httpsConfig, app);
}

function createWebSocketServer(server) {
    return require('./helpers/websocket-server').runWebSocketServer(server);
}

module.exports = { createHttpsServer, createWebSocketServer };