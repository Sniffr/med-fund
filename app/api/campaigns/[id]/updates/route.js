import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getCampaignById } from '@/lib/db/models/campaign';
import { createUpdate, getUpdatesByCampaignId } from '@/lib/db/models/update';
import { sendCampaignUpdateEmail } from '@/lib/email';
import clientPromise from '@/lib/db/mongodb';

// Get campaign updates
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { message: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    // Get campaign
    const campaign = await getCampaignById(id);
    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Get updates
    const updates = await getUpdatesByCampaignId(id);
    
    return NextResponse.json(updates, { status: 200 });
  } catch (error) {
    console.error('Error getting campaign updates:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create campaign update
export async function POST(request, { params }) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    let user;
    try {
      user = await verifyAuth(token);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { message: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    // Get campaign
    const campaign = await getCampaignById(id);
    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the campaign owner or admin
    if (campaign.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized to create updates for this campaign' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const data = await request.json();
    const { title, content, notifySubscribers } = data;
    
    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Create update
    const update = await createUpdate({
      campaignId: campaign._id,
      userId: user._id,
      title,
      content
    });
    
    // Send email notifications if requested
    if (notifySubscribers) {
      try {
        // Get subscribers (donors and followers)
        const client = await clientPromise;
        const db = client.db();
        
        // Get unique donor emails
        const donors = await db.collection('donations')
          .find({ 
            campaignId: campaign._id,
            email: { $exists: true, $ne: null }
          })
          .project({ email: 1, _id: 0 })
          .toArray();
        
        const subscriberEmails = [...new Set(donors.map(donor => donor.email))];
        
        if (subscriberEmails.length > 0) {
          await sendCampaignUpdateEmail(update, campaign, subscriberEmails);
        }
      } catch (emailError) {
        console.error('Error sending update notification emails:', emailError);
        // Continue even if email fails
      }
    }
    
    return NextResponse.json(update, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign update:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
