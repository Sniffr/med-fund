import AWS from 'aws-sdk';

// Configure AWS SDK with environment variables
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create S3 service object
const s3 = new AWS.S3();

// S3 bucket name
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'photos-inc';

/**
 * Upload a file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} key - S3 object key (path)
 * @param {string} contentType - File content type
 * @returns {Promise<string>} S3 file URL
 */
export async function uploadFileToS3(fileBuffer, key, contentType) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

/**
 * Generate a presigned URL for downloading a file from S3
 * @param {string} key - S3 object key (path)
 * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
 * @returns {Promise<string>} Presigned URL
 */
export async function getPresignedUrl(key, expiresIn = 3600) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };

  try {
    return s3.getSignedUrl('getObject', { ...params, Expires: expiresIn });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

/**
 * Delete a file from S3
 * @param {string} key - S3 object key (path)
 * @returns {Promise<void>}
 */
export async function deleteFileFromS3(key) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
}

/**
 * Generate a unique filename to prevent collisions in S3
 * @param {string} originalFilename - Original filename
 * @returns {string} Unique filename
 */
export function generateUniqueFileName(originalFilename) {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalFilename);
  const basename = path.basename(originalFilename, extension);
  
  return `${basename}-${timestamp}-${randomString}${extension}`;
}

/**
 * Extract S3 key from URL
 * @param {string} url - S3 URL
 * @returns {string} S3 key
 */
export function extractKeyFromUrl(url) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    if (hostname.includes('s3.amazonaws.com')) {
      // Format: https://bucket-name.s3.amazonaws.com/key
      return urlObj.pathname.substring(1); // Remove leading slash
    } else if (hostname.endsWith('amazonaws.com') && urlObj.pathname.startsWith(`/${BUCKET_NAME}/`)) {
      // Format: https://s3.region.amazonaws.com/bucket-name/key
      return urlObj.pathname.substring(BUCKET_NAME.length + 2); // Remove /bucket-name/
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting key from URL:', error);
    return null;
  }
}
