const { productionEnv, httpsProdConfig } = require('./production.config');
const { developmentEnv, httpsDevConfig } = require('./development.config');
const { initialDbSetup } = require('../mongo/mongo-initial');

function getCurrentEnvironment(NODE_ENV) {
    return Object.assign({},  process.env.NODE_ENV === 'production' ? productionEnv : developmentEnv);
}

function getHttpsConfig(NODE_ENV) {
    return Object.assign({},  process.env.NODE_ENV === 'production' ? httpsProdConfig : httpsDevConfig);
}

const currentEnv = getCurrentEnvironment(process.env.NODE_ENV);
const httpsConfig = getHttpsConfig(process.env.NODE_ENV);

initialDbSetup();

module.exports = { currentEnv, httpsConfig };