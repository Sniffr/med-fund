const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://archer:LKJeP90UTTLr418t@cluster0.h5wj3us.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB = process.env.MONGODB_DB || 'med-fund';

async function testConnection() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    console.log('Connected to MongoDB successfully!');
    
    const db = client.db(MONGODB_DB);
    
    // Test a simple query
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

testConnection()
  .then(success => {
    console.log('MongoDB test completed. Success:', success);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error during MongoDB test:', err);
    process.exit(1);
  });
