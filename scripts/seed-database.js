const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://archer:LKJeP90UTTLr418t@cluster0.h5wj3us.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_DB = process.env.MONGODB_DB || 'med-fund';

async function seedDatabase() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    console.log('Connected to MongoDB successfully!');
    
    const db = client.db(MONGODB_DB);
    
    // Clear existing data
    await clearCollections(db);
    
    // Seed users
    const users = await seedUsers(db);
    
    // Seed campaigns
    const campaigns = await seedCampaigns(db, users);
    
    // Seed donations
    await seedDonations(db, campaigns, users);
    
    // Seed testimonials
    await seedTestimonials(db);
    
    // Seed success stories
    await seedSuccessStories(db);
    
    console.log('Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Failed to seed database:', error);
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

async function clearCollections(db) {
  console.log('Clearing existing collections...');
  const collections = ['users', 'campaigns', 'donations', 'testimonials', 'successStories', 'documents', 'updates'];
  
  for (const collection of collections) {
    await db.collection(collection).deleteMany({});
    console.log(`Cleared ${collection} collection`);
  }
}

async function seedUsers(db) {
  console.log('Seeding users...');
  
  const users = [
    {
      _id: new ObjectId(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'b0.6.jVzOoQPw8L/36FEP.NpHT5Fnnq4Zu', // password: admin123
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new ObjectId(),
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: 'b0.6.jVzOoQPw8L/36FEP.NpHT5Fnnq4Zu', // password: admin123
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new ObjectId(),
      name: 'Michael Chen',
      email: 'michael@example.com',
      password: 'b0.6.jVzOoQPw8L/36FEP.NpHT5Fnnq4Zu', // password: admin123
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new ObjectId(),
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      password: 'b0.6.jVzOoQPw8L/36FEP.NpHT5Fnnq4Zu', // password: admin123
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await db.collection('users').insertMany(users);
  console.log(`Seeded ${users.length} users`);
  
  return users;
}

async function seedCampaigns(db, users) {
  console.log('Seeding campaigns...');
  
  const campaigns = [
    {
      _id: new ObjectId(),
      title: "Sarah's Cancer Treatment Fund",
      description: "Sarah was recently diagnosed with stage 2 breast cancer and needs help covering the costs of her treatment. Your support will help pay for chemotherapy, radiation, and surgery.",
      medicalCondition: "Breast Cancer",
      patientName: "Sarah Johnson",
      patientAge: 35,
      hospitalName: "Memorial Cancer Center",
      goalAmount: 50000,
      currentAmount: 32500,
      status: 'verified',
      submittedForVerification: true,
      userId: users[1]._id,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: new Date(),
      coverImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      category: 'Cancer',
      featured: true
    },
    {
      _id: new ObjectId(),
      title: "Michael's Heart Surgery Fund",
      description: "Michael needs an urgent heart surgery to repair a congenital heart defect. The surgery is expensive but necessary for his survival. Please help us raise the funds needed for this life-saving procedure.",
      medicalCondition: "Congenital Heart Defect",
      patientName: "Michael Chen",
      patientAge: 28,
      hospitalName: "City Heart Hospital",
      goalAmount: 75000,
      currentAmount: 45000,
      status: 'verified',
      submittedForVerification: true,
      userId: users[2]._id,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      updatedAt: new Date(),
      coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      category: 'Heart Disease',
      featured: true
    },
    {
      _id: new ObjectId(),
      title: "Emily's Kidney Transplant",
      description: "Emily has been on dialysis for 3 years and finally has a kidney donor match. We need help covering the transplant costs and post-surgery care. Your donation will give Emily a chance at a normal life again.",
      medicalCondition: "Kidney Failure",
      patientName: "Emily Rodriguez",
      patientAge: 42,
      hospitalName: "University Medical Center",
      goalAmount: 100000,
      currentAmount: 68000,
      status: 'verified',
      submittedForVerification: true,
      userId: users[3]._id,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      updatedAt: new Date(),
      coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      category: 'Transplant',
      featured: false
    },
    {
      _id: new ObjectId(),
      title: "David's Rare Disease Treatment",
      description: "David has been diagnosed with a rare genetic disorder that requires specialized treatment only available abroad. We're raising funds to cover medical expenses, travel, and accommodation for his family during treatment.",
      medicalCondition: "Rare Genetic Disorder",
      patientName: "David Wilson",
      patientAge: 8,
      hospitalName: "International Specialty Clinic",
      goalAmount: 150000,
      currentAmount: 25000,
      status: 'pending',
      submittedForVerification: true,
      userId: users[1]._id,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: new Date(),
      coverImage: 'https://images.unsplash.com/photo-1581056771107-24247a7e6794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      category: 'Rare Disease',
      featured: false
    }
  ];
  
  await db.collection('campaigns').insertMany(campaigns);
  console.log(`Seeded ${campaigns.length} campaigns`);
  
  return campaigns;
}

async function seedDonations(db, campaigns, users) {
  console.log('Seeding donations...');
  
  const donations = [];
  
  // Generate donations for each campaign
  for (const campaign of campaigns) {
    const numDonations = Math.floor(Math.random() * 20) + 10; // 10-30 donations per campaign
    
    for (let i = 0; i < numDonations; i++) {
      const isAnonymous = Math.random() > 0.7; // 30% chance of anonymous donation
      const amount = Math.floor(Math.random() * 1000) + 50; // 0-050
      
      donations.push({
        _id: new ObjectId(),
        campaignId: campaign._id,
        userId: isAnonymous ? null : users[Math.floor(Math.random() * users.length)]._id,
        amount,
        message: getRandomDonationMessage(),
        anonymous: isAnonymous,
        donorName: isAnonymous ? 'Anonymous' : null,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
        updatedAt: new Date()
      });
    }
  }
  
  await db.collection('donations').insertMany(donations);
  console.log(`Seeded ${donations.length} donations`);
}

async function seedTestimonials(db) {
  console.log('Seeding testimonials...');
  
  const testimonials = [
    {
      _id: new ObjectId(),
      name: 'John Smith',
      title: 'Cancer Survivor',
      content: 'Med-Fund helped me raise the money I needed for my cancer treatment when I had nowhere else to turn. The platform was easy to use and the support team was amazing.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new ObjectId(),
      name: 'Maria Garcia',
      title: 'Mother of Heart Patient',
      content: 'When my son needed heart surgery, Med-Fund made it possible for us to afford the best care. We raised the funds in just 3 weeks and the surgery was a success!',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new ObjectId(),
      name: 'Robert Johnson',
      title: 'Kidney Transplant Recipient',
      content: 'I waited 5 years for a kidney donor match, but couldn\'t afford the procedure. Thanks to Med-Fund, I received my transplant and have a new lease on life.',
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=644&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await db.collection('testimonials').insertMany(testimonials);
  console.log(`Seeded ${testimonials.length} testimonials`);
}

async function seedSuccessStories(db) {
  console.log('Seeding success stories...');
  
  const successStories = [
    {
      _id: new ObjectId(),
      title: 'Lisa\'s Victory Over Leukemia',
      content: 'After being diagnosed with leukemia, Lisa\'s family turned to Med-Fund to help cover the costs of her treatment. Thanks to the generosity of 342 donors, they raised 8,000 in just 2 months. Today, Lisa is cancer-free and back to living her life to the fullest.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new ObjectId(),
      title: 'The Martinez Family\'s Journey',
      content: 'When baby Sofia was born with a rare heart condition, the Martinez family faced medical bills exceeding 50,000. Their Med-Fund campaign went viral, raising the full amount in just 3 weeks. Sofia\'s successful surgery has given her a chance at a healthy life.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new ObjectId(),
      title: 'James\' Innovative Treatment',
      content: 'James was diagnosed with a rare form of cancer that required an experimental treatment not covered by insurance. Through Med-Fund, he raised 20,000 to access this cutting-edge therapy. One year later, his doctors have declared him cancer-free.',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await db.collection('successStories').insertMany(successStories);
  console.log(`Seeded ${successStories.length} success stories`);
}

function getRandomDonationMessage() {
  const messages = [
    'Wishing you a speedy recovery!',
    'Stay strong, we\'re all rooting for you!',
    'Sending healing thoughts your way.',
    'You\'re in our prayers.',
    'Hope this helps a little bit. Get well soon!',
    'Thinking of you during this difficult time.',
    'You got this!',
    'Sending love and support.',
    'We\'re here for you.',
    'Stay positive and keep fighting!'
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = seedDatabase;
