import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { updateCampaignAmountRaised } from './campaign';

export async function createDonation(donationData) {
  const client = await clientPromise;
  const db = client.db();
  const now = new Date();
  const donation = {
    ...donationData,
    createdAt: now,
    status: 'completed' // Since we're not processing payments yet
  };
  const result = await db.collection('donations').insertOne(donation);
  
  // Update campaign amount raised
  if (donation.campaignId) {
    await updateCampaignAmountRaised(donation.campaignId, donation.amount);
  }
  
  return { ...donation, _id: result.insertedId };
}

export async function getDonationsByCampaignId(campaignId, options = {}) {
  const { limit = 10, skip = 0, sort = { createdAt: -1 } } = options;
  const client = await clientPromise;
  const db = client.db();
  return db.collection('donations')
    .find({ campaignId: campaignId.toString(), status: 'completed' })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
}
