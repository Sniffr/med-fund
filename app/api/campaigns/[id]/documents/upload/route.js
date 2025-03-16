import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { verifyAuth } from '@/lib/auth';
import { uploadFileToS3, generateUniqueFileName } from '@/lib/s3';
import { ObjectId } from 'mongodb';

// Upload a document for a campaign
export async function POST(request, { params }) {
  try {
    // Verify authentication
    try {
      const user = await verifyAuth(request);
      if (!user) {
        return NextResponse.json(
          { message: 'Authentication required' },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid authentication token' },
        { status: 401 }
      );
    }
    
    // Get campaign ID from params
    const campaignId = params.id;
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Check if campaign exists and belongs to user
    const campaign = await db.collection('campaigns').findOne({
      _id: new ObjectId(campaignId),
      userId: user._id
    });
    
    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found or access denied' },
        { status: 404 }
      );
    }
    
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const fileName = generateUniqueFileName(file.name);
    
    // Upload to S3
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadFileToS3(
      fileBuffer,
      `campaigns/${campaignId}/${fileName}`,
      file.type
    );
    
    // Create document record
    const documentData = {
      campaignId: new ObjectId(campaignId),
      name: file.name,
      type: formData.get('type') || 'medical',
      description: formData.get('description') || 'Medical document',
      fileUrl,
      fileType: file.type,
      fileSize: file.size,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('documents').insertOne(documentData);
    const document = { ...documentData, _id: result.insertedId };
    
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
