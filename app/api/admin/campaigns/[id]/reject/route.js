import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyAuth, isAdmin } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { sendEmail } from '@/lib/email';

/**
 * POST /api/admin/campaigns/[id]/reject
 * Reject a campaign (admin only)
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
    
    // Get rejection reason from request body
    const body = await request.json().catch(() => ({}));
    const { reason } = body;
    
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
          status: 'rejected',
          rejectedAt: new Date(),
          rejectedBy: user._id.toString(),
          rejectionReason: reason || 'Did not meet verification requirements',
          submittedForVerification: false,
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
      try {
        await sendEmail({
          to: campaignCreator.email,
          subject: 'Your Campaign Needs Attention',
          text: `Your campaign "${campaign.title}" could not be verified at this time. Reason: ${reason || 'Did not meet verification requirements'}. Please update your campaign and submit it for verification again.`,
          html: `
            <h1>Your Campaign Needs Attention</h1>
            <p>Your campaign "${campaign.title}" could not be verified at this time.</p>
            <p><strong>Reason:</strong> ${reason || 'Did not meet verification requirements'}</p>
            <p>Please update your campaign and submit it for verification again.</p>
            <p>You can edit your campaign at <a href="${process.env.NEXT_PUBLIC_BASE_URL}/campaigns/${id}/edit">this link</a>.</p>
          `
        });
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
        // Continue execution even if email fails
      }
    }
    
    // Create notification
    await db.collection('notifications').insertOne({
      userId: campaign.userId,
      type: 'campaign_rejected',
      message: `Your campaign "${campaign.title}" could not be verified. Reason: ${reason || 'Did not meet verification requirements'}`,
      campaignId: id,
      read: false,
      createdAt: new Date()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error rejecting campaign:', error);
    return NextResponse.json({ error: 'Failed to reject campaign' }, { status: 500 });
  }
}
