'use strict'
const { isMaster, isWorker, fork } = require('cluster');
const { createExpressApp, launchAppServer } = require('./app');
const { createMasterExpressApp, launchMasterServer } = require('./app');
const { createHttpsServer, createWebSocketServer } = require('./server');
const { createFunctionProxy } = require('./logger/function-proxy');
const { LogsServiceMaster, LogsServiceChild } = require('./logger/master-service');

function createCluster(multiInstance) {
  const app = {}
  app.childProcess = [];
  multiInstance ? createMultiInstanceApp(app) : createSingleInstanceApp(app);
  return app;
}

function createMultiInstanceApp(app) {
  if (isMaster) {
    app.express = createMasterExpressApp();
    app.server = createHttpsServer(app.express);
    launchMasterServer(app.server);
    forkChildProcess(app, 1);
    app.logger = new LogsServiceMaster(app);
  } else if (isWorker) {
    app.express = createExpressApp();
    app.server = createHttpsServer(app.express);
    createFunctionProxy(launchAppServer, undefined, [app.express, app.server]);
    app.logger = new LogsServiceChild();    
  }
}

function forkChildProcess(app, processCounter) {
  if (processCounter <= 0) return;
  const child = fork();
  app.childProcess.push(child);
  processCounter--;
  child.on('listening', (address) => {
    forkChildProcess(app, processCounter)
  });
}

function createSingleInstanceApp(app) {
  app.express = createExpressApp();
  app.server = createHttpsServer(app.express);
  createFunctionProxy(launchAppServer, undefined, [app.express, app.server])
    .then(() => {
      app.wss = createWebSocketServer(app.server);
    });
}

module.exports = { createCluster };