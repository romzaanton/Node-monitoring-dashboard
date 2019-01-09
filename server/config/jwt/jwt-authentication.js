const jwt = require('jsonwebtoken');
const fs = require('fs');

const cookieName = '$pvc';
const privateKEY  = fs.readFileSync(__dirname + '/private.key', 'utf8');
const publicKEY  = fs.readFileSync(__dirname + '/public.key', 'utf8'); 
const payload = {
    data1: "Data 1",
};

var signOptions = {
    issuer:  'RA Corp',
    subject:  'romza@ya.com',
    audience:  'https://localhost:3001',
    expiresIn:  '24h',
    algorithm:  'RS256'
};

const token = jwt.sign(payload, privateKEY, signOptions);

var verifyOptions = {
    issuer:  'RA Corp',
    subject:  'romza@ya.com',
    audience:  'https://localhost:3001',
    expiresIn:  '1h',
    algorithm:  ['RS256']
};

const legit = jwt.verify(token, publicKEY, verifyOptions);

function createJWToken() {
    return jwt.sign(payload, privateKEY, signOptions);
}

function verifyJWToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, publicKEY, (err, decoded) => {
            if(err) {
                resolve(false);
            }
            resolve(true);
        });
    })
}

module.exports = { createJWToken, verifyJWToken, cookieName };