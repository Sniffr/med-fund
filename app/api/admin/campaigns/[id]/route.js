import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyAuth, isAdmin } from '@/lib/auth';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/campaigns/[id]
 * Get a single campaign by ID for admin
 */
export async function GET(request, { params }) {
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
    
    // Get campaign by ID
    const campaign = await db.collection('campaigns').findOne({ _id: new ObjectId(id) });
    
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    // Get documents for this campaign
    const documents = await db.collection('documents')
      .find({ campaignId: id })
      .toArray();
    
    // Get updates for this campaign
    const updates = await db.collection('updates')
      .find({ campaignId: id })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Get donations for this campaign
    const donations = await db.collection('donations')
      .find({ campaignId: id })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({
      ...campaign,
      documents,
      updates,
      donations
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/campaigns/[id]
 * Update a campaign by ID (admin only)
 */
export async function PUT(request, { params }) {
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
    
    const data = await request.json();
    
    // Remove fields that shouldn't be updated directly
    const { _id, createdAt, ...updateData } = data;
    
    const { db } = await connectToDatabase();
    
    // Update campaign
    const result = await db.collection('campaigns').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/campaigns/[id]
 * Delete a campaign by ID (admin only)
 */
export async function DELETE(request, { params }) {
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
    
    // Delete campaign
    const result = await db.collection('campaigns').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    // Delete related documents
    await db.collection('documents').deleteMany({ campaignId: id });
    
    // Delete related updates
    await db.collection('updates').deleteMany({ campaignId: id });
    
    // Delete related donations
    await db.collection('donations').deleteMany({ campaignId: id });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}
