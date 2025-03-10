import { getCampaignById, updateCampaign } from '@/lib/db/models/campaign';
import { createNotification } from '@/lib/db/models/notification';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Submit campaign for verification
export async function POST(request, { params }) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid campaign ID' },
        { status: 400 }
      );
    }
    
    // Check if campaign exists
    const campaign = await getCampaignById(id);
    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Update campaign status
    const success = await updateCampaign(id, {
      status: 'pending'
    });
    
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to submit campaign for verification' },
        { status: 500 }
      );
    }
    
    // Create notification for admins
    // In a real app, you would query for admin users and notify them
    // For simplicity, we'll just create a notification for the campaign creator
    await createNotification({
      recipient: campaign.creator,
      type: 'verification_submitted',
      message: 'Your campaign has been submitted for verification',
      relatedTo: new ObjectId(id),
      relatedModel: 'Campaign'
    });
    
    return NextResponse.json(
      { message: 'Campaign submitted for verification successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting campaign for verification:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
