const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

const url = process.env.DATABASE_URL

const databaseName = process.env.DATABASE_NAME;


let db;

async function connection() {

    if (db) {

        return db;
    }

    try {

        const client = new MongoClient(url);

        await client.connect();

        console.log("Connected to MongoDB Databaase");

        db = client.db(databaseName);

        return db;

    } catch (error) {

        console.error("Error connecting to MongoDB:", error);
        throw error;
    }

}

module.exports = { connection }