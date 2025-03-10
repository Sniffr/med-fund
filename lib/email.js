import nodemailer from 'nodemailer';

// Configure email transport with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USER || 'no-reply@jungopharm.com',
    pass: process.env.SMTP_PASS || 'Jungo2025!!'
  }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text email body
 * @param {string} options.html - HTML email body
 * @param {string} [options.from] - Sender email address (defaults to configured SMTP_USER)
 * @returns {Promise<Object>} - Nodemailer send result
 */
export async function sendEmail(options) {
  try {
    const { to, subject, text, html, from } = options;
    
    const mailOptions = {
      from: from || process.env.SMTP_USER || 'no-reply@example.com',
      to,
      subject,
      text,
      html
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send a campaign verification email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.campaignTitle - Campaign title
 * @param {string} options.verificationUrl - Verification URL
 * @returns {Promise<Object>} - Nodemailer send result
 */
export async function sendVerificationEmail(options) {
  const { to, campaignTitle, verificationUrl } = options;
  
  const subject = `Your campaign "${campaignTitle}" has been verified`;
  
  const text = `
    Dear Campaign Owner,
    
    We're pleased to inform you that your campaign "${campaignTitle}" has been verified and is now live on our platform.
    
    You can view your campaign at: ${verificationUrl}
    
    Thank you for using our platform to raise funds for your medical needs.
    
    Best regards,
    MedFund Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Campaign Verified</h2>
      <p>Dear Campaign Owner,</p>
      <p>We're pleased to inform you that your campaign "${campaignTitle}" has been verified and is now live on our platform.</p>
      <p>You can view your campaign at: <a href="${verificationUrl}" style="color: #4f46e5;">${verificationUrl}</a></p>
      <p>Thank you for using our platform to raise funds for your medical needs.</p>
      <p>Best regards,<br>MedFund Team</p>
    </div>
  `;
  
  return sendEmail({ to, subject, text, html });
}

/**
 * Send a donation receipt email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.donorName - Donor name
 * @param {string} options.campaignTitle - Campaign title
 * @param {number} options.amount - Donation amount
 * @param {string} options.campaignUrl - Campaign URL
 * @returns {Promise<Object>} - Nodemailer send result
 */
export async function sendDonationReceiptEmail(options) {
  const { to, donorName, campaignTitle, amount, campaignUrl } = options;
  
  const subject = `Thank you for your donation to "${campaignTitle}"`;
  
  const text = `
    Dear ${donorName || 'Supporter'},
    
    Thank you for your generous donation of $${amount.toFixed(2)} to "${campaignTitle}".
    
    Your support makes a significant difference in helping with medical expenses and treatment costs.
    
    You can view the campaign at: ${campaignUrl}
    
    Best regards,
    MedFund Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Thank You for Your Donation</h2>
      <p>Dear ${donorName || 'Supporter'},</p>
      <p>Thank you for your generous donation of <strong>$${amount.toFixed(2)}</strong> to "${campaignTitle}".</p>
      <p>Your support makes a significant difference in helping with medical expenses and treatment costs.</p>
      <p>You can view the campaign at: <a href="${campaignUrl}" style="color: #4f46e5;">${campaignUrl}</a></p>
      <p>Best regards,<br>MedFund Team</p>
    </div>
  `;
  
  return sendEmail({ to, subject, text, html });
}

/**
 * Send a campaign update notification email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.campaignTitle - Campaign title
 * @param {string} options.updateTitle - Update title
 * @param {string} options.updateContent - Update content
 * @param {string} options.campaignUrl - Campaign URL
 * @returns {Promise<Object>} - Nodemailer send result
 */
export async function sendCampaignUpdateEmail(options) {
  const { to, campaignTitle, updateTitle, updateContent, campaignUrl } = options;
  
  const subject = `New update for "${campaignTitle}"`;
  
  const text = `
    Dear Supporter,
    
    There's a new update for the campaign "${campaignTitle}" that you've supported:
    
    ${updateTitle}
    
    ${updateContent}
    
    You can view the full update at: ${campaignUrl}
    
    Thank you for your continued support.
    
    Best regards,
    MedFund Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Campaign Update</h2>
      <p>Dear Supporter,</p>
      <p>There's a new update for the campaign "${campaignTitle}" that you've supported:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="margin-top: 0;">${updateTitle}</h3>
        <p>${updateContent}</p>
      </div>
      <p>You can view the full update at: <a href="${campaignUrl}" style="color: #4f46e5;">${campaignUrl}</a></p>
      <p>Thank you for your continued support.</p>
      <p>Best regards,<br>MedFund Team</p>
    </div>
  `;
  
  return sendEmail({ to, subject, text, html });
}
