import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyAuth } from '@/lib/auth';
import { getPresignedUrl } from '@/lib/s3';
import { ObjectId } from 'mongodb';

// Get documents for a campaign
export async function GET(request, { params }) {
  try {
    const campaignId = params.id;
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Check if campaign exists
    const campaign = await db.collection('campaigns').findOne({
      _id: new ObjectId(campaignId)
    });
    
    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Get documents
    const documents = await db.collection('documents').find({
      campaignId: new ObjectId(campaignId)
    }).toArray();
    
    // Generate presigned URLs for documents
    const documentsWithUrls = await Promise.all(documents.map(async (document) => {
      try {
        // Extract key from fileUrl
        const url = new URL(document.fileUrl);
        const key = url.pathname.substring(1); // Remove leading slash
        
        // Generate presigned URL
        const presignedUrl = await getPresignedUrl(key);
        
        return {
          ...document,
          presignedUrl
        };
      } catch (error) {
        console.error('Error generating presigned URL:', error);
        return document;
      }
    }));
    
    return NextResponse.json(documentsWithUrls);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
