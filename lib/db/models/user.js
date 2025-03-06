import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { hashPassword, comparePassword } from '@/lib/auth';

export async function createUser(userData) {
  const client = await clientPromise;
  const db = client.db();
  
  // Check if user with email already exists
  const existingUser = await db.collection('users').findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Hash password
  const hashedPassword = await hashPassword(userData.password);
  
  const now = new Date();
  const user = {
    ...userData,
    password: hashedPassword,
    role: userData.role || 'user',
    createdAt: now,
    updatedAt: now
  };
  
  const result = await db.collection('users').insertOne(user);
  
  // Remove password from returned user object
  const { password, ...userWithoutPassword } = user;
  return { ...userWithoutPassword, _id: result.insertedId };
}

export async function getUserById(id) {
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
  
  if (user) {
    // Remove password from returned user object
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}

export async function getUserByEmail(email) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection('users').findOne({ email });
}

export async function authenticateUser(email, password) {
  const user = await getUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  // Remove password from returned user object
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function updateUser(id, updateData) {
  const client = await clientPromise;
  const db = client.db();
  
  // If updating password, hash it
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }
  
  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
  
  return result;
}

export async function getUsers(options = {}) {
  const { limit = 10, skip = 0, role, sort = { createdAt: -1 } } = options;
  const client = await clientPromise;
  const db = client.db();
  const query = role ? { role } : {};
  
  const users = await db.collection('users')
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
  
  // Remove passwords from returned user objects
  return users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
}
