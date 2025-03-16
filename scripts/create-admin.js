/**
 * Script to create an admin user in the Med-Fund database
 * 
 * Usage:
 * node scripts/create-admin.js
 * 
 * The script will prompt for name, email, and password
 */

const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://archer:LKJeP90UTTLr418t@cluster0.h5wj3us.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = process.env.DB_NAME || 'med-fund';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function createAdminUser() {
  try {
    // Get user input
    console.log('=== Create Admin User ===');
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    
    // Validate inputs
    if (!name || !email || !password) {
      console.error('Error: Name, email, and password are required');
      rl.close();
      process.exit(1);
    }
    
    if (password.length < 8) {
      console.error('Error: Password must be at least 8 characters long');
      rl.close();
      process.exit(1);
    }
    
    if (!email.includes('@')) {
      console.error('Error: Invalid email format');
      rl.close();
      process.exit(1);
    }
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    
    // Check if user with this email already exists
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(`User with email ${email} already exists and is already an admin`);
      } else {
        // Update existing user to admin role
        await usersCollection.updateOne(
          { _id: existingUser._id },
          { $set: { role: 'admin' } }
        );
        console.log(`Updated existing user ${email} to admin role`);
      }
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new admin user
      const newUser = {
        _id: new ObjectId(),
        name,
        email,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      };
      
      await usersCollection.insertOne(newUser);
      
      console.log(`Admin user created successfully: ${email}`);
    }
    
    // Close MongoDB connection
    await client.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    rl.close();
  }
}

createAdminUser();
