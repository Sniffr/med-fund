import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { createCampaign, getAllCampaigns, getFeaturedCampaigns } from '@/lib/db/models/campaign';
import { uploadFileToS3, generateUniqueFileName } from '@/lib/s3';
import { createDocument } from '@/lib/db/models/document';
import { ObjectId } from 'mongodb';

// Get all campaigns with filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const sort = searchParams.get('sort');
    const status = searchParams.get('status');
    
    if (featured) {
      const featuredCampaigns = await getFeaturedCampaigns(category, limit);
      return NextResponse.json(featuredCampaigns, { status: 200 });
    }
    
    const filter = {};
    
    // Add category filter if provided
    if (category) {
      filter.category = category;
    }
    
    // Only show active campaigns by default
    if (!searchParams.has('status')) {
      filter.status = 'active';
    } else if (status) {
      filter.status = status;
    }
    
    const sortOptions = {};
    if (sort === 'currentAmount') {
      sortOptions.currentAmount = -1;
    } else {
      // Default sort by createdAt
      sortOptions.createdAt = -1;
    }
    
    const result = await getAllCampaigns(page, limit, filter, sortOptions);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new campaign
export async function POST(request) {
  try {
    // Check if the request is form data or JSON
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data submission with file uploads
      // Verify authentication
      const token = request.cookies.get('auth_token')?.value;
      if (!token) {
        return NextResponse.json(
          { message: 'Authentication required' },
          { status: 401 }
        );
      }

      let user;
      try {
        user = await verifyAuth(token);
      } catch (error) {
        return NextResponse.json(
          { message: 'Invalid authentication token' },
          { status: 401 }
        );
      }
      
      // Parse form data
      const formData = await request.formData();
      
      // Extract campaign data
      const campaignData = {
        title: formData.get('title'),
        category: formData.get('category'),
        patientName: formData.get('patientName'),
        patientAge: formData.get('patientAge'),
        relationship: formData.get('relationship'),
        goal: parseFloat(formData.get('goal')),
        story: formData.get('story'),
        treatmentPlan: formData.get('treatmentPlan'),
        userId: user._id,
        status: 'draft',
        currentAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Validate required fields
      if (!campaignData.title || !campaignData.category || !campaignData.goal) {
        return NextResponse.json(
          { message: 'Title, category, and goal are required' },
          { status: 400 }
        );
      }
      
      // Create campaign in database
      const campaign = await createCampaign(campaignData);
      
      // Handle file uploads
      const files = formData.getAll('files');
      
      if (files && files.length > 0) {
        for (const file of files) {
          if (file instanceof File) {
            try {
              // Generate unique filename
              const fileName = generateUniqueFileName(file.name);
              
              // Upload to S3
              const fileBuffer = Buffer.from(await file.arrayBuffer());
              const fileUrl = await uploadFileToS3(
                fileBuffer,
                `campaigns/${campaign._id}/${fileName}`,
                file.type
              );
              
              // Create document record
              await createDocument({
                campaignId: campaign._id,
                userId: user._id,
                name: file.name,
                type: 'medical',
                description: 'Medical document',
                fileUrl,
                fileType: file.type,
                fileSize: file.size,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
              });
            } catch (uploadError) {
              console.error('Error uploading file:', uploadError);
              // Continue with other files even if one fails
            }
          }
        }
      }
      
      return NextResponse.json(campaign, { status: 201 });
    } else {
      // Handle JSON submission (backward compatibility)
      const data = await request.json();
      const { title, category, description, story, treatmentPlan, goal, patient, creator } = data;
      
      // Validate required fields
      if (!title || !category || !description || !goal || !creator) {
        return NextResponse.json(
          { message: 'Missing required fields' },
          { status: 400 }
        );
      }
      
      // Create campaign object
      const campaignData = {
        title,
        category,
        creator: new ObjectId(creator),
        patient: patient || {
          name: '',
          age: null,
          relationship: ''
        },
        description,
        story: story || '',
        treatmentPlan: treatmentPlan || '',
        goal: parseFloat(goal),
        timeline: {
          startDate: new Date(),
          endDate: data.endDate ? new Date(data.endDate) : null,
          milestones: data.milestones || []
        }
      };
      
      const campaignId = await createCampaign(campaignData);
      
      return NextResponse.json(
        { 
          message: 'Campaign created successfully',
          campaignId
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
