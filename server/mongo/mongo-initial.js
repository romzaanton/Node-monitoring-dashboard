'use strict';
const { MongoClient } = require('mongodb');

const host = 'localhost';
const port = 27017;
const adminDb = 'admin';
const logsCollectionName = 'Logs';
const usersCollectionName = 'Users';
const authMechanism = 'DEFAULT';
const mongoClient = new MongoClient(`mongodb://${host}:${port}/?authMechanism=${authMechanism}`, { useNewUrlParser: true });

function getDataBase(dbName) {
    return new Promise((resolve, reject) => {
        if (!mongoClient.isConnected()) {
            mongoClient.connect((error, client) => {
                if (error) {
                    console.error(err);
                }
                const db = mongoClient.db(dbName);
                resolve(db);
            });
        } else {
            resolve(mongoClient.db(dbName));
        }
        
    })
}

async function getDbCollections(db) {
    const collections = await db.collections()
    return collections; 
}

function getCollectionsNames(collections) {
    const names = collections.map(v => v.collectionName);
    return names;
}

function findCollectionByName(name, collectionNames) {
    return collectionNames.find(v => v === name);
}

async function createCollection(dbName, collectionName, collectionOptions) {
    const defaultCollectionName = collectionName || dbName;
    const db = await getDataBase(dbName);
    const collections = await getDbCollections(db);
    const collectionsNames = getCollectionsNames(collections);
    const collection = findCollectionByName(defaultCollectionName, collectionsNames);
    if(!collection) { 
        const newCollection = await db.createCollection(defaultCollectionName, collectionOptions);
    }
}

function getUserCollectionCreateOptions(collectionName) {
    return {
        create: collectionName,
        capped: false,
        validator:  getUsersCollectionValidator(),
        validationLevel: 'strict',
        validationAction: 'error',
    }
}

function getLogsCollectionCreateOptions(collectionName) {
    return {
        create: collectionName,
        capped: false,
    }
}

function getUsersCollectionValidator() {
    return {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'password'],
            properties: {
                name: {
                    bsonType: 'string',
                    description: "Name of the web user",
                    minLength: 8,
                },
                password: {
                    bsonType: 'string',
                    description: "password",
                    minLength: parseInt(process.env.passwordLength),
                },
            }
        }
    }
}

function initialDbSetup() {
    createCollection(usersCollectionName, undefined, getUserCollectionCreateOptions(usersCollectionName));
    createCollection(logsCollectionName, undefined, getLogsCollectionCreateOptions(logsCollectionName));
}

module.exports = { initialDbSetup, mongoClient, getDataBase, usersCollectionName, logsCollectionName };
