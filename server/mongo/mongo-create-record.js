const { getDataBase, usersCollectionName, logsCollectionName } = require('./mongo-initial');
const { getHashDataAsync } = require('../helpers/data-hashing');

async function saveUserToDb(payload) {
  payload.password = await getHashDataAsync(payload.password);
  const db = await getDataBase(usersCollectionName);
  return new Promise((resolve, reject) => {
    db.collection(usersCollectionName).insertOne(payload, (err, count) => {
      if (err) {
        reject(err)
      }
      resolve(count)
    })
  });
}


function createLoggerDbRecordSync(payload) {
  const db = getDataBase(logsCollectionName)
    .then(resultDb => {
      return new Promise((resolve, reject) => {
        resultDb.collection(logsCollectionName).insertOne(payload, (err, count) => {
          if (err) {
            reject(err);
          }
          resolve(count)
        })
      })
    })
    .then(result => result)
    .catch(err => {
      console.error(err);
    });
}

module.exports = {
  saveUserToDb,
  createLoggerDbRecordSync
};
