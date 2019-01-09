const { connectionConfig } = require('./connection.config');
const fs = require('fs');

const productionEnv = Object.assign({}, {
    NODE_ENV: 'production',
    production: true,
    passwordLength: 12,
    recordLogs: false,
    multiInstance: true,
    singlePort: false,
}, connectionConfig);

const httpsProdConfig = {
    key: fs.readFileSync(__dirname + '/https/cert.key'),
    cert: fs.readFileSync(__dirname + '/https/cert.pem'),
};

process.on('uncaughtException', (err) => {
    fs.writeSync(1, `Uncaught exception ${err}\n`);
});

module.exports = { productionEnv, httpsProdConfig };
