import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/db/models/user';
import { verifyToken } from '@/lib/auth';

// Get current user
export async function GET(request) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated', user: null },
        { status: 200 }
      );
    }
    
    // Verify token
    const decoded = verifyToken(token);
    console.log('Decoded token in /api/auth/me:', decoded);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { message: 'Invalid token', user: null },
        { status: 200 }
      );
    }
    
    // Get user from database
    const user = await getUserById(decoded.id);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found', user: null },
        { status: 200 }
      );
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json(
      { message: 'Internal server error', user: null },
      { status: 200 }
    );
  }
}
