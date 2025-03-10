import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';

export async function createNotification(notificationData) {
  const client = await clientPromise;
  const db = client.db();
  const now = new Date();
  const notification = {
    ...notificationData,
    createdAt: now,
    read: false
  };
  const result = await db.collection('notifications').insertOne(notification);
  return { ...notification, _id: result.insertedId };
}

export async function getNotificationsByUserId(userId) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection('notifications')
    .find({ userId: userId.toString() })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function markNotificationAsRead(id) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection('notifications').updateOne(
    { _id: new ObjectId(id) },
    { $set: { read: true } }
  );
}

export async function deleteNotification(id) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection('notifications').deleteOne({ _id: new ObjectId(id) });
}
