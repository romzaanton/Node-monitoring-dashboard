'use strict'
const { worker } = require('cluster');
const express = require('express');
const helmet = require('helmet');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const { addHttpPerformanceTracker } = require('./logger/master-service');
const { createFunctionProxy } = require('./logger/function-proxy');
const accountRoutes = require('./routes/authorization');

function createExpressApp() {
  const app = express();
  app.set('port', process.env.port);
  app.use(helmet());
  app.use('/user', accountRoutes);
  app.use(addHttpPerformanceTracker);
  return app;
}

async function launchAppServer(app, httpsServer) {
    let config = require('../nuxt.config.js');
    config.dev = !(process.env.NODE_ENV === 'production');
    const nuxt = new Nuxt(config);
    if (config.dev) {
        const builder = new Builder(nuxt);
        await createFunctionProxy(builder.build, builder, []).then(() => {
            app.use(nuxt.render);
        });
    }
    if (process.env.singlePort === 'false' && process.env.multiInstance === 'true') {
        process.env.port = parseInt(process.env.port) + (worker ? worker.id : 0);
    }
    httpsServer.listen(process.env.port, process.env.host);
    consola.ready({
        message: `Worker server listening on https://${process.env.host}:${process.env.port} pid:${process.pid}`,
        badge: true
    });
    return app;
}

function createMasterExpressApp() {
    const app = express();
    app.set('port', process.env.port);
    app.use(helmet());
    app.use((req, res, next) => {
        console.log(`Master service request ${req.method}  ${req.path}`);
        res.status(200).send(ok);
    });
    return app;
}

function launchMasterServer(httpsServer) {
    httpsServer.listen(process.env.port, process.env.host);
    consola.ready({
        message: `Master server listening on https://${process.env.host}:${process.env.port}  pid:${process.pid}`,
        badge: true
    });
    return httpsServer;
}

module.exports = {
  createExpressApp,
  launchAppServer,
  createMasterExpressApp,
  launchMasterServer
};
