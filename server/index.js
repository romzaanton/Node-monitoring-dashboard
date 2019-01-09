'use strict'
const { currentEnv } = require('./config/config');
const { createCluster } = require('./cluster');
const { setGlobalVariable } = require('./helpers/global-variables');

Object.assign(process.env, currentEnv);

const app = createCluster(currentEnv.multiInstance);

setGlobalVariable('app', app);





