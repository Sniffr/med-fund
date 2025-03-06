import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';

// Get testimonials
export async function GET(request) {
  try {
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get testimonials from database
    const testimonials = await db
      .collection('testimonials')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    // If no testimonials found, return empty array
    if (!testimonials || testimonials.length === 0) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
