import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';

// Get campaign by ID
export async function getCampaignById(id) {
  const { db } = await connectToDatabase();
  
  return db.collection('campaigns').findOne({
    _id: typeof id === 'string' ? new ObjectId(id) : id
  });
}

// Get all campaigns with pagination
export async function getAllCampaigns(page = 1, limit = 10, filter = {}, sort = { createdAt: -1 }) {
  const { db } = await connectToDatabase();
  
  const skip = (page - 1) * limit;
  
  const campaigns = await db.collection('campaigns')
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();
  
  const total = await db.collection('campaigns').countDocuments(filter);
  
  return {
    campaigns,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
}

// Create a new campaign
export async function createCampaign(campaignData) {
  const { db } = await connectToDatabase();
  
  const campaign = {
    ...campaignData,
    userId: campaignData.userId ? (typeof campaignData.userId === 'string' 
      ? new ObjectId(campaignData.userId) 
      : campaignData.userId) : null,
    creator: campaignData.creator ? (typeof campaignData.creator === 'string'
      ? new ObjectId(campaignData.creator)
      : campaignData.creator) : null,
    status: campaignData.status || 'draft',
    currentAmount: campaignData.currentAmount || 0,
    raised: campaignData.raised || 0,
    createdAt: campaignData.createdAt || new Date(),
    updatedAt: new Date(),
    verificationStatus: campaignData.verificationStatus || {
      isVerified: false,
      documents: []
    }
  };
  
  const result = await db.collection('campaigns').insertOne(campaign);
  return { ...campaign, _id: result.insertedId };
}

// Update campaign
export async function updateCampaign(id, updateData) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('campaigns').updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
  return result;
}

// Delete campaign
export async function deleteCampaign(id) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('campaigns').deleteOne({
    _id: typeof id === 'string' ? new ObjectId(id) : id
  });
  
  return result.deletedCount > 0;
}

// Add campaign document
export async function addCampaignDocument(campaignId, document) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('campaigns').updateOne(
    { _id: typeof campaignId === 'string' ? new ObjectId(campaignId) : campaignId },
    { 
      $push: { 
        'verificationStatus.documents': {
          ...document,
          _id: new ObjectId(),
          verified: false,
          uploadedAt: new Date()
        }
      },
      $set: { updatedAt: new Date() }
    }
  );
  
  return result.modifiedCount > 0;
}

// Verify campaign
export async function verifyCampaign(campaignId, adminId) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('campaigns').updateOne(
    { _id: typeof campaignId === 'string' ? new ObjectId(campaignId) : campaignId },
    { 
      $set: {
        status: 'active',
        'verificationStatus.isVerified': true,
        'verificationStatus.verifiedBy': adminId,
        'verificationStatus.verifiedAt': new Date(),
        updatedAt: new Date()
      } 
    }
  );
  
  return result.modifiedCount > 0;
}

// Reject campaign
export async function rejectCampaign(campaignId, reason) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('campaigns').updateOne(
    { _id: typeof campaignId === 'string' ? new ObjectId(campaignId) : campaignId },
    { 
      $set: {
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date()
      } 
    }
  );
  
  return result.modifiedCount > 0;
}

// Get pending campaigns
export async function getPendingCampaigns(page = 1, limit = 10) {
  return getAllCampaigns(page, limit, { 
    status: 'pending', 
    'verificationStatus.isVerified': false 
  });
}

// Get featured campaigns
export async function getFeaturedCampaigns(category = null, limit = 3) {
  const { db } = await connectToDatabase();
  
  const filter = { 
    status: 'active',
    ...(category ? { category } : {})
  };
  
  return db.collection('campaigns')
    .find({ status: 'verified', featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

// Increment campaign amount
export async function incrementCampaignAmount(id, amount) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('campaigns').updateOne(
    { _id: typeof id === 'string' ? new ObjectId(id) : id },
    { 
      $inc: { currentAmount: amount, raised: amount },
      $set: { updatedAt: new Date() }
    }
  );
  
  return result.modifiedCount > 0;
}
