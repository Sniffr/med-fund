import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyAuth, isAdmin } from '@/lib/auth';

/**
 * GET /api/admin/dashboard
 * Get dashboard statistics
 */
export async function GET(request) {
  try {
    // Verify authentication and admin role
    const user = await verifyAuth(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // Get total campaigns count
    const totalCampaigns = await db.collection('campaigns').countDocuments();
    
    // Get total donations amount
    const donationsResult = await db.collection('donations').aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();
    const totalDonations = donationsResult.length > 0 ? donationsResult[0].total : 0;
    
    // Get total users count
    const totalUsers = await db.collection('users').countDocuments();
    
    // Get pending verification count
    const pendingVerification = await db.collection('campaigns').countDocuments({ 
      status: 'pending', 
      submittedForVerification: true 
    });
    
    // Get recent campaigns
    const recentCampaigns = await db.collection('campaigns')
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    return NextResponse.json({
      totalCampaigns,
      totalDonations,
      totalUsers,
      pendingVerification,
      recentCampaigns
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
