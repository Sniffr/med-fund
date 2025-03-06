const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  try {
    console.log('Testing email configuration...');
    
    const host = process.env.SMTP_HOST || 'smtppro.zoho.eu';
    const port = process.env.SMTP_PORT || 465;
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER || 'no-reply@jungopharm.com';
    const pass = process.env.SMTP_PASS || 'Jungo2025!!';
    
    console.log('Email configuration:');
    console.log('- SMTP Host:', host);
    console.log('- SMTP Port:', port);
    console.log('- SMTP Secure:', secure);
    console.log('- SMTP User:', user);
    
    // Create a transporter but don't actually send an email
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    });
    
    // Verify the connection configuration
    await transporter.verify();
    
    console.log('Email configuration verified successfully!');
    return true;
  } catch (error) {
    console.error('Failed to verify email configuration:', error);
    return false;
  }
}

testEmail()
  .then(success => {
    console.log('Email test completed. Success:', success);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error during email test:', err);
    process.exit(1);
  });
