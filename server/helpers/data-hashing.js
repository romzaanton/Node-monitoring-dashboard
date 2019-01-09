const bcrypt = require('bcrypt');
const saltRounds = 10;

function getHashDataAsync(data) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(data, saltRounds, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
  })
}

function validateHashedDataAsync(plainData, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainData, hash, (err, res) => {
        if (err) {
            reject(err);
        }
        resolve(res);
    });
  })
}

module.exports = {
  getHashDataAsync,
  validateHashedDataAsync
};
