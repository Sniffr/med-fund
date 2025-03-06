## Backend Implementation Plan for Medical Crowdfunding Platform

### Database Architecture

First, I'll establish the MongoDB schema design to support all platform functionality:

```javascript
// User Schema
const userSchema = {
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  role: String (user, admin, moderator),
  createdAt: Date,
  status: String (active, suspended, inactive),
  verificationStatus: {
    identityVerified: Boolean,
    emailVerified: Boolean,
    phoneVerified: Boolean
  },
  profile: {
    avatar: String,
    bio: String,
    contactInfo: { ... }
  }
}

// Campaign Schema
const campaignSchema = {
  _id: ObjectId,
  title: String,
  category: String,
  creator: { type: ObjectId, ref: 'User' },
  patient: {
    name: String,
    age: Number,
    relationship: String
  },
  description: String,
  story: String,
  treatmentPlan: String,
  goal: Number,
  raised: Number,
  timeline: {
    startDate: Date,
    endDate: Date,
    milestones: [{ 
      date: Date, 
      description: String 
    }]
  },
  status: String (pending, active, completed, rejected),
  verificationStatus: {
    isVerified: Boolean,
    verifiedBy: ObjectId,
    verifiedAt: Date,
    documents: [{
      _id: ObjectId,
      title: String,
      fileUrl: String,
      verified: Boolean,
      type: String,
      uploadedAt: Date
    }]
  },
  createdAt: Date,
  updatedAt: Date
}

// Donation Schema
const donationSchema = {
  _id: ObjectId,
  campaign: { type: ObjectId, ref: 'Campaign' },
  donor: { type: ObjectId, ref: 'User' },
  amount: Number,
  message: String,
  isAnonymous: Boolean,
  paymentMethod: String,
  transactionId: String,
  status: String (completed, pending, failed),
  createdAt: Date
}

// Update Schema
const updateSchema = {
  _id: ObjectId,
  campaign: { type: ObjectId, ref: 'Campaign' },
  title: String,
  content: String,
  attachments: [String],
  createdAt: Date
}

// Notification Schema
const notificationSchema = {
  _id: ObjectId,
  recipient: { type: ObjectId, ref: 'User' },
  type: String,
  message: String,
  relatedTo: ObjectId,
  relatedModel: String,
  isRead: Boolean,
  createdAt: Date
}

// Settings Schema for Admin
const settingsSchema = {
  platformName: String,
  platformUrl: String,
  supportEmail: String,
  platformDescription: String,
  defaultFee: Number,
  minGoal: Number,
  maxGoal: Number,
  maintenanceMode: Boolean,
  verification: {
    requireDiagnosis: Boolean,
    requireCost: Boolean,
    requireInsurance: Boolean,
    requireID: Boolean,
    requireProviderContact: Boolean,
    verificationTimeout: Number
  }
}
```

### API Routes Implementation

Now, I'll develop REST API endpoints to support the user journey:

#### Authentication & User Management
```javascript
// User registration
POST /api/auth/register
// User login
POST /api/auth/login
// Logout
POST /api/auth/logout
// Refresh token
POST /api/auth/refresh
// Password reset
POST /api/auth/reset-password
// User profile update
PUT /api/users/:id
// Verify identity (can include document upload)
POST /api/users/verify
```

#### Campaign Management
```javascript
// Create a campaign
POST /api/campaigns
// Get all campaigns with filtering options
GET /api/campaigns
// Get campaign by ID
GET /api/campaigns/:id
// Update campaign
PUT /api/campaigns/:id
// Upload campaign documents
POST /api/campaigns/:id/documents
// Get campaign updates
GET /api/campaigns/:id/updates
// Add campaign update
POST /api/campaigns/:id/updates
// Get campaign donors
GET /api/campaigns/:id/donors
```

#### Donation System
```javascript
// Create a donation
POST /api/donations
// Get donations for a campaign
GET /api/campaigns/:id/donations
// Get donations by user
GET /api/users/:id/donations
// Process payment webhook
POST /api/donations/webhook
```

#### Verification System
```javascript
// Submit campaign for verification
POST /api/campaigns/:id/submit-verification
// Admin: Verify campaign
POST /api/admin/campaigns/:id/verify
// Admin: Reject campaign
POST /api/admin/campaigns/:id/reject
```

#### Admin Routes
```javascript
// Dashboard statistics
GET /api/admin/dashboard
// Campaigns management
GET /api/admin/campaigns
// Verify pending campaigns
GET /api/admin/verification
// User management
GET /api/admin/users
PUT /api/admin/users/:id
// Donation management
GET /api/admin/donations
// Reports and analytics
GET /api/admin/reports
// System settings
GET /api/admin/settings
PUT /api/admin/settings
```

### Authentication & Authorization

I'll implement JWT (JSON Web Token) authentication with role-based access control:

```javascript
// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware for role-based authorization
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    next();
  };
};
```

### File Upload System

For document uploads and verification:

```javascript
// Using Next.js API routes with Multer for file handling
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb) {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only certain file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
}).array('documents', 5);

// API route handler
export default async function handler(req, res) {
  try {
    // Process file upload
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Get uploaded files info
    const files = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    // Save file references to the database
    const { campaignId } = req.query;
    
    // Update campaign with document references
    await Campaign.findByIdAndUpdate(campaignId, {
      $push: { 
        'verificationStatus.documents': files.map(file => ({
          title: file.originalName,
          fileUrl: `/uploads/${file.filename}`,
          verified: false,
          type: file.mimetype,
          uploadedAt: new Date()
        }))
      }
    });
    
    res.status(200).json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
```

### Payment Integration

I'll integrate with payment providers for donations:

```javascript
// Example with Stripe integration
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// API route for creating payment intent
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, campaignId, donorId, isAnonymous, message } = req.body;
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        campaignId,
        donorId,
        isAnonymous: isAnonymous ? 'true' : 'false'
      }
    });
    
    // Create pending donation record
    const donation = await Donation.create({
      campaign: campaignId,
      donor: donorId,
      amount,
      message,
      isAnonymous,
      paymentMethod: 'card',
      transactionId: paymentIntent.id,
      status: 'pending',
      createdAt: new Date()
    });
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      donationId: donation._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Webhook handler for payment completion
export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { campaignId, donorId } = paymentIntent.metadata;
      
      // Update donation status
      await Donation.findOneAndUpdate(
        { transactionId: paymentIntent.id },
        { status: 'completed' }
      );
      
      // Update campaign raised amount
      await Campaign.findByIdAndUpdate(
        campaignId,
        { $inc: { raised: paymentIntent.amount / 100 } }
      );
      
      // Create notification for campaign creator
      const campaign = await Campaign.findById(campaignId);
      await Notification.create({
        recipient: campaign.creator,
        type: 'donation',
        message: 'Your campaign received a new donation!',
        relatedTo: campaignId,
        relatedModel: 'Campaign',
        isRead: false,
        createdAt: new Date()
      });
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
```

### Notification System

For real-time updates:

```javascript
// Server-side notification creation
const createNotification = async (recipientId, type, message, relatedTo, relatedModel) => {
  return await Notification.create({
    recipient: recipientId,
    type,
    message,
    relatedTo,
    relatedModel,
    isRead: false,
    createdAt: new Date()
  });
};

// API route for fetching user notifications
export default async function handler(req, res) {
  try {
    const { userId } = req.query;
    
    const notifications = await Notification.find({ 
      recipient: userId 
    })
    .sort({ createdAt: -1 })
    .limit(20);
    
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Mark notification as read
export default async function handler(req, res) {
  try {
    const { notificationId } = req.body;
    
    await Notification.findByIdAndUpdate(notificationId, {
      isRead: true
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

### Admin Backend

For the admin dashboard:

```javascript
// Admin Dashboard Stats
export default async function handler(req, res) {
  try {
    // Verify admin authorization
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    // Get total donations
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get campaign counts
    const campaignCounts = await Campaign.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get recent donations
    const recentDonations = await Donation.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('campaign', 'title')
      .populate('donor', 'name');
    
    // Get verification queue
    const pendingVerifications = await Campaign.countDocuments({
      status: 'pending',
      'verificationStatus.isVerified': false
    });
    
    res.status(200).json({
      totalDonationsAmount: totalDonations[0]?.total || 0,
      campaignStats: campaignCounts,
      pendingVerifications,
      recentDonations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Verification Queue
export default async function handler(req, res) {
  try {
    const { page = 1, limit = 10, priority } = req.query;
    
    let query = { status: 'pending', 'verificationStatus.isVerified': false };
    
    if (priority) {
      // Add priority filtering logic
      if (priority === 'urgent') {
        query.timeline = { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
      }
    }
    
    const campaigns = await Campaign.find(query)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('creator', 'name email');
    
    const total = await Campaign.countDocuments(query);
    
    res.status(200).json({
      campaigns,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Campaign Verification/Rejection
export default async function handler(req, res) {
  try {
    const { campaignId } = req.params;
    const { action, reason } = req.body;
    
    if (action === 'approve') {
      await Campaign.findByIdAndUpdate(campaignId, {
        status: 'active',
        'verificationStatus.isVerified': true,
        'verificationStatus.verifiedBy': req.user.id,
        'verificationStatus.verifiedAt': new Date()
      });
      
      // Notify campaign creator
      await createNotification(
        campaign.creator,
        'campaign_approved',
        'Your campaign has been approved and is now live!',
        campaignId,
        'Campaign'
      );
    } else if (action === 'reject') {
      await Campaign.findByIdAndUpdate(campaignId, {
        status: 'rejected',
        rejectionReason: reason
      });
      
      // Notify campaign creator
      await createNotification(
        campaign.creator,
        'campaign_rejected',
        `Your campaign was not approved. Reason: ${reason}`,
        campaignId,
        'Campaign'
      );
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
```

### Implementation Timeline and Approach

I propose implementing the backend in phases:

**Phase 1: Core Infrastructure (2 weeks)**
- Set up MongoDB with schemas
- Implement authentication system
- Create basic CRUD operations for campaigns
- Build admin authorization system

**Phase 2: Campaign & Verification System (2 weeks)**
- Implement file upload system
- Build campaign submission flow
- Create verification workflow
- Develop admin verification interface

**Phase 3: Donation System (2 weeks)**
- Integrate payment providers
- Implement donation tracking
- Build withdrawal system
- Set up notifications

**Phase 4: Advanced Features (2 weeks)**
- Implement search and filtering
- Build analytics and reporting
- Create user dashboard
- Develop notification system

**Phase 5: Testing & Optimization (1 week)**
- Security testing
- Performance optimization
- User experience testing
- Final adjustments

### Router Integration

To make the admin interface accessible via the `/admin` route, I'll update the Next.js routing configuration:

```javascript
// app/admin/page.tsx (already exists in your frontend)
// This will be accessible at /admin
```

I'll ensure these backend APIs are properly secured by implementing middleware that checks for admin privileges:

```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './utils/auth';

export async function middleware(request: NextRequest) {
  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      const verifiedToken = await verifyAuth(token);
      if (verifiedToken.role !== 'admin' && verifiedToken.role !== 'moderator') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

### Conclusion

This plan outlines a comprehensive backend implementation for your medical crowdfunding platform. The system is designed to:

1. **Support the entire user journey** from campaign creation to completion
2. **Ensure security and trust** with verification systems
3. **Enable efficient administration** through a powerful admin interface
4. **Facilitate donations** with reliable payment processing
5. **Provide accountability** with updates and documentation

The MongoDB schemas are structured to support all the relationships needed between users, campaigns, donations, and updates. The API endpoints cover all the necessary functionality for both users and administrators.

By implementing this backend, your platform will be able to handle the full range of functionality shown in your frontend, creating a complete and operational medical crowdfunding system.