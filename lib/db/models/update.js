import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export async function createUpdate(updateData) {
  const client = await clientPromise;
  const db = client.db();
  const now = new Date();
  const update = {
    ...updateData,
    createdAt: now,
    updatedAt: now
  };
  const result = await db.collection('updates').insertOne(update);
  return { ...update, _id: result.insertedId };
}

export async function getUpdatesByCampaignId(campaignId) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection('updates')
    .find({ campaignId: campaignId.toString() })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getUpdateById(id) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection('updates').findOne({ _id: new ObjectId(id) });
}

export async function deleteUpdate(id) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection('updates').deleteOne({ _id: new ObjectId(id) });
}
