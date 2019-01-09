const bcrypt = require('bcrypt');
const { getDataBase, usersCollectionName } = require('./mongo-initial');
const saltRounds = 10;

async function findUser(payload) {
    const db = await getDataBase(usersCollectionName);
    return new Promise((resolve, reject) => {
        const collection = db.collection(usersCollectionName);
        collection.findOne({name: payload.name}, (err, result) => {
            if (err) {
                reject(err)
            }
            resolve(result);
        });
    })
    
}

function getHashPassword(password){
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            }
            resolve(hash);
        })
    })
}

module.exports = { findUser };