import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyAuth, isAdmin } from '@/lib/auth';

/**
 * GET /api/admin/donations/chart
 * Get donation data for charts
 */
export async function GET(request) {
  try {
    // Verify authentication and admin role
    const user = await verifyAuth(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week'; // week, month, year
    
    const { db } = await connectToDatabase();
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }
    
    // Format for aggregation
    let dateFormat;
    let groupBy;
    
    switch (period) {
      case 'week':
        dateFormat = '%Y-%m-%d';
        groupBy = { $dateToString: { format: dateFormat, date: '$createdAt' } };
        break;
      case 'month':
        dateFormat = '%Y-%m-%d';
        groupBy = { $dateToString: { format: dateFormat, date: '$createdAt' } };
        break;
      case 'year':
        dateFormat = '%Y-%m';
        groupBy = { $dateToString: { format: dateFormat, date: '$createdAt' } };
        break;
      default:
        dateFormat = '%Y-%m-%d';
        groupBy = { $dateToString: { format: dateFormat, date: '$createdAt' } };
    }
    
    // Aggregate donations by date
    const donationsByDate = await db.collection('donations').aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate } 
        } 
      },
      { 
        $group: { 
          _id: groupBy,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        } 
      },
      { 
        $sort: { _id: 1 } 
      }
    ]).toArray();
    
    return NextResponse.json(donationsByDate);
  } catch (error) {
    console.error('Error fetching donation chart data:', error);
    return NextResponse.json({ error: 'Failed to fetch donation chart data' }, { status: 500 });
  }
}
