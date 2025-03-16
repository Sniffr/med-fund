import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getCampaignById } from '@/lib/db/models/campaign';
import { getDocumentById, updateDocument, deleteDocument } from '@/lib/db/models/document';
import { deleteFileFromS3 } from '@/lib/s3';

// Get a specific document
export async function GET(request, { params }) {
  try {
    const { documentId } = params;
    
    if (!documentId) {
      return NextResponse.json(
        { message: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    const document = await getDocumentById(documentId);
    
    if (!document) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error('Error getting document:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a document
export async function PUT(request, { params }) {
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

    const { id, documentId } = params;
    
    // Get campaign
    const campaign = await getCampaignById(id);
    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Get document
    const document = await getDocumentById(documentId);
    if (!document) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the campaign owner or admin
    if (campaign.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized to update this document' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const updateData = await request.json();
    
    // Update document
    const updatedDocument = await updateDocument(documentId, updateData);
    
    return NextResponse.json(updatedDocument, { status: 200 });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a document
export async function DELETE(request, { params }) {
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

    const { id, documentId } = params;
    
    // Get campaign
    const campaign = await getCampaignById(id);
    if (!campaign) {
      return NextResponse.json(
        { message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Get document
    const document = await getDocumentById(documentId);
    if (!document) {
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the campaign owner or admin
    if (campaign.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized to delete this document' },
        { status: 403 }
      );
    }
    
    // Delete file from S3
    if (document.s3Key) {
      await deleteFileFromS3(document.s3Key);
    }
    
    // Delete document from database
    await deleteDocument(documentId);
    
    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
