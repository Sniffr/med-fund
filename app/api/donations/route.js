import { NextResponse } from 'next/server';
import { createDonation } from '@/lib/db/models/donation';
import { getCampaignById } from '@/lib/db/models/campaign';
import { sendDonationReceiptEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['campaignId', 'amount'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Get campaign to include title in receipt
    const campaign = await getCampaignById(data.campaignId);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Create donation
    const donation = await createDonation({
      ...data,
      status: 'completed' // Since we're not processing payments yet
    });
    
    // Send receipt email if email provided
    if (data.email) {
      try {
        await sendDonationReceiptEmail({
          to: data.email,
          donorName: data.name || 'Supporter',
          campaignTitle: campaign.title,
          amount: data.amount,
          campaignUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/campaigns/${campaign._id}`
        });
      } catch (emailError) {
        console.error('Error sending donation receipt email:', emailError);
        // Continue even if email fails
      }
    }
    
    return NextResponse.json({ donation }, { status: 201 });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}
