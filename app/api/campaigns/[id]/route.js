import { getCampaignById, updateCampaign } from '@/lib/db/models/campaign';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Get campaign by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid campaign ID' },
        { status: 400 }
      );
    }
    
    const campaign = await getCampaignById(id);
    
    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(campaign, { status: 200 });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update campaign
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
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
    
    // Update campaign
    const success = await updateCampaign(id, data);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to update campaign' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Campaign updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
