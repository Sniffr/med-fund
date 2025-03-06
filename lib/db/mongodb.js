const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://archer:LKJeP90UTTLr418t@cluster0.h5wj3us.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB = process.env.MONGODB_DB || 'med-fund';

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
