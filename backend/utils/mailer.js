import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const { MAIL_USER, MAIL_PASS, FRONTEND_URL } = process.env;

if (!MAIL_USER || !MAIL_PASS) {
  throw new Error("Missing MAIL_USER or MAIL_PASS environment variables.");
}

console.log("MAIL_USER:", MAIL_USER);
console.log("MAIL_PASS:", MAIL_PASS ? "✓ set" : "❌ not set");
console.log("FRONTEND_URL:", FRONTEND_URL);

// Enhanced transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
  // Additional security options
  secure: true,
  requireTLS: true,
  tls: {
    rejectUnauthorized: false
  }
});

// Test connection on startup
const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    
    // Provide specific error guidance
    if (error.code === 'EAUTH') {
      console.error('🔑 Authentication failed. Please check:');
      console.error('   1. Use App Password (not regular Gmail password)');
      console.error('   2. Enable 2-Factor Authentication');
      console.error('   3. Generate App Password: https://myaccount.google.com/apppasswords');
    }
    
    return false;
  }
};

// Test connection when module loads
testConnection();

const sendEmail = async (options, context) => {
  try {
    // Test connection before sending
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("SMTP connection failed. Check your Gmail credentials.");
    }

    const info = await transporter.sendMail(options);
    console.log(`✅ Email sent successfully [${context}]:`, info.messageId);
    return info;
    
  } catch (err) {
    console.error(`❌ Nodemailer error in [${context}]:`, err);
    
    // Enhanced error messages based on error type
    if (err.code === 'EAUTH') {
      throw new Error("Authentication failed. Please check your Gmail App Password and ensure 2FA is enabled.");
    } else if (err.code === 'ENOTFOUND') {
      throw new Error("Network error. Please check your internet connection.");
    } else if (err.code === 'ETIMEDOUT') {
      throw new Error("Email service timeout. Please try again.");
    } else {
      throw new Error(`Email system error: ${err.message}`);
    }
  }
};

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Secxion 👁️‍🗨️" <${MAIL_USER}>`,
    to: email,
    subject: "🛡️ Verify Your Email - Secxion",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to Secxion!</h2>
        <p>Click the button below to verify your email and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you did not sign up, you can safely ignore this email.
        </p>
        <p>– Team Secxion</p>
      </div>
    `,
  };

  await sendEmail(mailOptions, "Verification Email");
};

export const sendResetCodeEmail = async (email, code, type) => {
  const label = type === "password" ? "Reset Your Password" : "Reset Telegram Number";

  const mailOptions = {
    from: `"Secxion 🛡️" <${MAIL_USER}>`,
    to: email,
    subject: `🔐 ${label} Code - Secxion`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">${label}</h2>
        <p>Use the verification code below to complete your ${type} reset request:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f8f9fa; border: 2px dashed #007bff; 
                      padding: 20px; border-radius: 10px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; color: #007bff; 
                         letter-spacing: 4px;">${code}</span>
          </div>
        </div>
        <p style="color: #666; font-size: 14px;">
          This code will expire in 10 minutes.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you did not request this, you can safely ignore this email.
        </p>
        <p>– Team Secxion</p>
      </div>
    `,
  };

  await sendEmail(mailOptions, "Reset Code Email");
};

export const sendBankVerificationCode = async (email, code) => {
  const mailOptions = {
    from: `"Secxion 🏦" <${MAIL_USER}>`,
    to: email,
    subject: `🔐 Confirm Bank Account Addition - Secxion`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Bank Account Verification</h2>
        <p>Use the verification code below to confirm your bank account addition:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f8f9fa; border: 2px dashed #28a745; 
                      padding: 20px; border-radius: 10px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; color: #28a745; 
                         letter-spacing: 4px;">${code}</span>
          </div>
        </div>
        <p style="color: #666; font-size: 14px;">
          This code will expire in 10 minutes.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you did not attempt to add a bank account, you can safely ignore this email.
        </p>
        <p>– Team Secxion</p>
      </div>
    `,
  };

  await sendEmail(mailOptions, "Bank Verification Email");
};