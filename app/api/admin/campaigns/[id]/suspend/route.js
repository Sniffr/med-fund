import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyAuth, isAdmin } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { sendEmail } from '@/lib/email';

/**
 * POST /api/admin/campaigns/[id]/suspend
 * Suspend a campaign (admin only)
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
    
    // Get suspension reason from request body
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
          status: 'suspended',
          suspendedAt: new Date(),
          suspendedBy: user._id.toString(),
          suspensionReason: reason || 'Suspended by administrator',
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
          subject: 'Your Campaign Has Been Suspended',
          text: `Your campaign "${campaign.title}" has been suspended. Reason: ${reason || 'Suspended by administrator'}. Please contact support for more information.`,
          html: `
            <h1>Your Campaign Has Been Suspended</h1>
            <p>Your campaign "${campaign.title}" has been suspended.</p>
            <p><strong>Reason:</strong> ${reason || 'Suspended by administrator'}</p>
            <p>Please contact support for more information and to discuss next steps.</p>
          `
        });
      } catch (emailError) {
        console.error('Error sending suspension email:', emailError);
        // Continue execution even if email fails
      }
    }
    
    // Create notification
    await db.collection('notifications').insertOne({
      userId: campaign.userId,
      type: 'campaign_suspended',
      message: `Your campaign "${campaign.title}" has been suspended. Reason: ${reason || 'Suspended by administrator'}`,
      campaignId: id,
      read: false,
      createdAt: new Date()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error suspending campaign:', error);
    return NextResponse.json({ error: 'Failed to suspend campaign' }, { status: 500 });
  }
}
