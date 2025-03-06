import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyAuth, isAdmin } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { sendEmail } from '@/lib/email';

/**
 * POST /api/admin/campaigns/[id]/verify
 * Verify a campaign (admin only)
 */
export async function POST(request, { params }) {
  try {
    // Verify authentication and admin role
    const user = await verifyAuth(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    
    // Get campaign
    const campaign = await db.collection('campaigns').findOne({ _id: new ObjectId(id) });
    
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    // Update campaign status
    const result = await db.collection('campaigns').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'verified',
          verifiedAt: new Date(),
          verifiedBy: user._id.toString(),
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    // Get campaign creator
    const campaignCreator = await db.collection('users').findOne({ _id: new ObjectId(campaign.userId) });
    
    if (campaignCreator && campaignCreator.email) {
      // Send email notification
      await sendEmail({
        to: campaignCreator.email,
        subject: 'Your Campaign Has Been Verified',
        text: `Congratulations! Your campaign "${campaign.title}" has been verified and is now live on our platform.`,
        html: `
          <h1>Congratulations!</h1>
          <p>Your campaign "${campaign.title}" has been verified and is now live on our platform.</p>
          <p>You can view your campaign at <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/campaigns/${id}">this link</a>.</p>
        `
      });
    }
    
    // Create notification
    await db.collection('notifications').insertOne({
      userId: campaign.userId,
      type: 'campaign_verified',
      message: `Your campaign "${campaign.title}" has been verified and is now live.`,
      campaignId: id,
      read: false,
      createdAt: new Date()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying campaign:', error);
    return NextResponse.json({ error: 'Failed to verify campaign' }, { status: 500 });
  }
}
