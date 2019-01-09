function isJSONObject(message) {
    return message.search(/^({).*?(})$/gi) >= 0; 
}

function parseJSONObject(message) {
    let parsed;
    try {
        parsed = JSON.parse(message);
    } catch (error) {
        console.error(error);
        parsed = {};
    }
    return parsed;
}

module.exports = { isJSONObject, parseJSONObject };
