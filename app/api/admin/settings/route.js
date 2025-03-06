import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyAuth, isAdmin } from '@/lib/auth';

/**
 * GET /api/admin/settings
 * Get application settings
 */
export async function GET(request) {
  try {
    // Verify authentication and admin role
    const user = await verifyAuth(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // Get settings from database
    const settings = await db.collection('settings').findOne({ _id: 'app_settings' });
    
    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = {
        _id: 'app_settings',
        siteName: 'Med-Fund',
        siteDescription: 'Medical crowdfunding platform',
        contactEmail: 'support@med-fund.com',
        featuredCampaigns: [],
        verificationRequired: true,
        minDonationAmount: 5,
        maxDonationAmount: 10000,
        updatedAt: new Date(),
        createdAt: new Date()
      };
      
      await db.collection('settings').insertOne(defaultSettings);
      
      return NextResponse.json(defaultSettings);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/settings
 * Update application settings
 */
export async function PUT(request) {
  try {
    // Verify authentication and admin role
    const user = await verifyAuth(request);
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Remove fields that shouldn't be updated directly
    const { _id, createdAt, ...updateData } = data;
    
    const { db } = await connectToDatabase();
    
    // Update settings
    const result = await db.collection('settings').updateOne(
      { _id: 'app_settings' },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date() 
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );
    
    // Get updated settings
    const updatedSettings = await db.collection('settings').findOne({ _id: 'app_settings' });
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
