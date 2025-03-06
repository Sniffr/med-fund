import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Logout user
export async function POST() {
  try {
    // Clear auth token cookie
    const cookieStore = cookies();
    cookieStore.delete('auth_token');
    
    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
