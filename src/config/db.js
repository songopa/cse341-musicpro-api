require('dotenv').config();
const { MongoClient } = require('mongodb');
let db;
let client;

async function connectToDb() {
    if (db) return db;
    const uri = process.env.MONGODB_URI;
    if (!uri || typeof uri !== 'string') {
        throw new Error('MONGODB_URI is not set or invalid. Please set MONGODB_URI in your environment.');
    }
    client = new MongoClient(uri);
    await client.connect();
    const dbName = process.env.MONGODB_NAME || undefined;
    db = dbName ? client.db(dbName) : client.db();
    console.log('Connected to MongoDB:', db.databaseName);
    return db;
}

function getDb() {
    if (!db) throw new Error('DB not connected');
    return db;
}

async function closeDb() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('MongoDB connection closed');
    }
}

module.exports = { connectToDb, getDb, closeDb };
