const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

async function testS3() {
  try {
    console.log('Testing S3 connection...');
    
    // Test listing buckets
    const listBucketsResponse = await s3Client.send(new ListBucketsCommand({}));
    console.log('S3 Buckets:', listBucketsResponse.Buckets.map(b => b.Name));
    console.log('S3 connection successful!');
    
    return true;
  } catch (error) {
    console.error('Failed to connect to S3:', error);
    return false;
  }
}

testS3()
  .then(success => {
    console.log('S3 test completed. Success:', success);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error during S3 test:', err);
    process.exit(1);
  });
