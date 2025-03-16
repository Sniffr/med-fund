const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'med-fund';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Cache the MongoDB connection to reuse it across requests
let cachedClient = null;
let cachedDb = null;

/**
 * Connect to MongoDB
 * @returns {Promise<{client: MongoClient, db: Db}>}
 */
export async function connectToDatabase() {
  // If we have a cached connection, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If no cached connection, create a new one
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  
  const db = client.db(MONGODB_DB);
  
  // Cache the connection
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}
