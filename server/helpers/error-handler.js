'use strict'
function throwError(message) {
    const err =  new Error(message);
    console.error(err.stack);
    throw err;
}

function handleError(err, message) {
    console.error(err);
    console.trace(err);
    if (message) {
        console.error(message);
    }
}

module.exports = { throwError, handleError };
