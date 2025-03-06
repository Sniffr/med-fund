import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './db/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '7d';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
export function generateToken(user) {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role || 'user',
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify a JWT token
 * @param {String} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Verify authentication from request
 * @param {Request} request - Next.js request object
 * @returns {Object|null} User object or null if not authenticated
 */
export async function verifyAuth(request) {
  try {
    // Get token from cookies or authorization header
    let token;
    
    // Try to get from cookies first (for server components)
    if (cookies) {
      const cookieStore = cookies();
      token = cookieStore.get('token')?.value;
    }
    
    // If no token in cookies, try authorization header
    if (!token && request.headers) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return null;
    }
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }
    
    // Get user from database
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

/**
 * Check if a user has admin role
 * @param {Object} user - User object
 * @returns {Boolean} True if user is admin
 */
export function isAdmin(user) {
  return user && user.role === 'admin';
}

/**
 * Set authentication token in cookies
 * @param {Response} response - Next.js response object
 * @param {String} token - JWT token
 */
export function setAuthCookie(response, token) {
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear authentication token from cookies
 * @param {Response} response - Next.js response object
 */
export function clearAuthCookie(response) {
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}
