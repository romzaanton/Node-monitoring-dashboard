const { Console } = require('console');
const { Writable } = require('stream');

class LoggerStdIn extends Writable {
    constructor() {
        super({
            highWaterMark: 32,
            decodeStrings: true,
            objectMode: true,
        })
    }
    write(chunk, encoding, callback) {
        if (global.$loggerServer) {
            global.$loggerServer.send(chunk);
        }
    }
}

class LoggerConsole extends Console {
    constructor(loggerStdIn) {
        super({
            stdout: loggerStdIn,
            stderr: loggerStdIn,
            ignoreErrors: false,
        })
    }
    _trace(label, messageType) {
        this.trace(`[[${label}=/=${messageType}=/=${Date.now()}]]`);
    }
}

const loggerStdIn = new LoggerStdIn();
const loggerConsole = new LoggerConsole(loggerStdIn);

module.exports = { loggerConsole }; 