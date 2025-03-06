import { createUser, getUserByEmail } from '@/lib/db/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      status: 'active',
      verificationStatus: {
        identityVerified: false,
        emailVerified: false,
        phoneVerified: false
      },
      profile: {
        avatar: '',
        bio: '',
        contactInfo: {}
      }
    };

    const userId = await createUser(userData);

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
