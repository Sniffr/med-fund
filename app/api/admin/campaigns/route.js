import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyAuth, isAdmin } from '@/lib/auth';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/campaigns
 * Get campaigns for admin dashboard with filtering options
 */
export async function GET(request) {
  try {
    // Verify authentication and admin role
    const user = await verifyAuth(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const status = searchParams.get('status');
    const submittedForVerification = searchParams.get('submittedForVerification');
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (submittedForVerification) {
      query.submittedForVerification = submittedForVerification === 'true';
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    // Get campaigns with pagination
    const campaigns = await db.collection('campaigns')
      .find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const total = await db.collection('campaigns').countDocuments(query);
    
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
