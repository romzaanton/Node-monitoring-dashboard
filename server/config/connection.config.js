const productionConfig = {
    host: 'localhost',
    port: 3001,
}

const developmentConfig = {
    host: 'localhost',
    port: 3001,
}

const connectionConfig = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;

module.exports = { connectionConfig };
