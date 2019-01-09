const { connectionConfig } = require('./connection.config');
const fs = require('fs');

const developmentEnv = Object.assign({}, {
    NODE_ENV: 'development',
    production: false,
    passwordLength: 4,
    recordLogs: false,
    multiInstance: true,
    singlePort: false,
}, connectionConfig);

const httpsDevConfig = {
    key: fs.readFileSync(__dirname + '/https/cert.key'),
    cert: fs.readFileSync(__dirname + '/https/cert.pem'),
};

process.on('uncaughtException', (err) => {
    fs.writeSync(1, `Uncaught exception ${err}\n`);
});

module.exports = { developmentEnv, httpsDevConfig };
