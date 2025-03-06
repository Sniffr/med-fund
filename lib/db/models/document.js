import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';

// Document types
export const DOCUMENT_TYPES = {
  MEDICAL_REPORT: 'medical_report',
  IDENTITY: 'identity',
  PROOF_OF_TREATMENT: 'proof_of_treatment',
  COST_ESTIMATE: 'cost_estimate',
  OTHER: 'other'
};

// Document statuses
export const DOCUMENT_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

/**
 * Create a new document
 * @param {Object} documentData - Document data
 * @returns {Promise<Object>} Created document
 */
export async function createDocument(documentData) {
  const { db } = await connectToDatabase();
  
  // Ensure campaignId is an ObjectId
  if (documentData.campaignId && typeof documentData.campaignId === 'string') {
    documentData.campaignId = new ObjectId(documentData.campaignId);
  }
  
  const document = {
    ...documentData,
    campaignId: typeof documentData.campaignId === 'string' 
      ? new ObjectId(documentData.campaignId) 
      : documentData.campaignId,
    userId: typeof documentData.userId === 'string' 
      ? new ObjectId(documentData.userId) 
      : documentData.userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await db.collection('documents').insertOne(document);
  return { ...document, _id: result.insertedId };
}

/**
 * Get documents for a campaign
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Array>} Documents
 */
export async function getDocumentsByCampaignId(campaignId) {
  const { db } = await connectToDatabase();
  
  const documents = await db.collection('documents')
    .find({
      campaignId: typeof campaignId === 'string' ? new ObjectId(campaignId) : campaignId
    })
    .sort({ createdAt: -1 })
    .toArray();
  
  return documents;
}

/**
 * Get a document by ID
 * @param {string} documentId - Document ID
 * @returns {Promise<Object|null>} Document or null if not found
 */
export async function getDocumentById(documentId) {
  const { db } = await connectToDatabase();
  
  const document = await db.collection('documents').findOne({
    _id: typeof documentId === 'string' ? new ObjectId(documentId) : documentId
  });
  
  return document;
}

/**
 * Delete a document
 * @param {string} documentId - Document ID
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
export async function deleteDocument(documentId) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('documents').deleteOne({
    _id: new ObjectId(documentId)
  });
  
  return result.deletedCount > 0;
}

/**
 * Update a document
 * @param {string} documentId - Document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated document or null if not found
 */
export async function updateDocument(documentId, updateData) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('documents').findOneAndUpdate(
    { _id: typeof documentId === 'string' ? new ObjectId(documentId) : documentId },
    { 
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );
  
  return result.value;
}



/**
 * Get documents by type
 * @param {string} type - Document type
 * @returns {Promise<Array>} - Array of documents
 */
export async function getDocumentsByType(type) {
  const { db } = await connectToDatabase();
  
  return db.collection('documents').find({
    type
  }).toArray();
}
