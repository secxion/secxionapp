import dotenv from 'dotenv';
dotenv.config();

import nodemailer from "nodemailer";

const { MAIL_USER, MAIL_PASS, FRONTEND_URL } = process.env;

if (!MAIL_USER || !MAIL_PASS) {
  throw new Error("Missing MAIL_USER or MAIL_PASS environment variables.");
}

console.log("MAIL_USER:", MAIL_USER);
console.log("MAIL_PASS:", MAIL_PASS ? "✓ set" : "❌ not set");
console.log("FRONTEND_URL:", FRONTEND_URL);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Secxion 👁️‍🗨️" <${MAIL_USER}>`,
    to: email,
    subject: "🛡️ Verify Your Email - Secxion",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to Secxion!</h2>
        <p>Click the button below to verify your email and activate your account:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; border-radius: 5px; text-decoration: none;" target="_blank">
          Verify Email
        </a>
        <p style="margin-top: 20px;">If you did not sign up, you can safely ignore this email.</p>
        <p>– Team Secxion</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw new Error("Failed to send verification email. Please try again.");
  }
};

export const sendResetCodeEmail = async (email, code, type) => {
  const label = type === "password" ? "Reset Your Password" : "Reset Telegram Number";

  const mailOptions = {
    from: `"Secxion 🛡️" <${MAIL_USER}>`,
    to: email,
    subject: `🔐 ${label} Code - Secxion`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>${label}</h2>
        <p>Use the verification code below to complete your ${type} reset request:</p>
        <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">${code}</div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p>– Team Secxion</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending reset code email:", err);
    throw new Error("Failed to send reset code email. Please try again.");
  }
};

export const sendBankVerificationCode = async (email, code) => {
  const mailOptions = {
    from: `"Secxion 🏦" <${MAIL_USER}>`,
    to: email,
    subject: `🔐 Confirm Bank Account Addition - Secxion`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Bank Account Verification</h2>
        <p>Use the verification code below to confirm your bank account addition:</p>
        <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">${code}</div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not attempt to add a bank account, you can safely ignore this email.</p>
        <p>– Team Secxion</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending bank verification email:", err);
    throw new Error("Failed to send bank verification email.");
  }
};

