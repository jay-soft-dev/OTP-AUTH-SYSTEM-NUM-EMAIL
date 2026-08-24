const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const otpStore = new Map();
const JWT_SECRET = process.env.JWT_SECRET || 'secure_auth_secret_key_2026';

// 1. Send SMS via Fast2SMS
async function sendSMS(mobileNumber, otp) {
  try {
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: process.env.FAST2SMS_D6mY4Ky3oSXahrlpJMVk2RwUuN0WcA8qGPFLsHbtOd9xgETjeBytdxkAaoPrFgezSmITvn3qbNiQ2LZ4,
        variables_values: otp,
        route: 'otp',
        numbers: mobileNumber
      }
    });
    console.log('[Fast2SMS Status]: Sent successfully', response.data);
  } catch (error) {
    console.error('[Fast2SMS Error]:', error.response ? error.response.data : error.message);
  }
}

// 2. Send Email via Nodemailer
async function sendEmail(userEmail, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your App Password
      }
    });

    const mailOptions = {
      from: `"Security Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Your OTP Verification Code',
      text: `Your OTP verification code is: ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Status]: Sent successfully to ${userEmail}`);
  } catch (error) {
    console.error('[Email Error]:', error.message);
  }
}

// Route: Send OTP (Handles both Mobile and Email)
app.post('/api/send-otp', async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: 'Email or Mobile number is required' });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(identifier, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  console.log(`\n===================================`);
  console.log(`[OTP GENERATED] User: ${identifier}`);
  console.log(`[SECURITY CODE] OTP: ${otp}`);
  console.log(`===================================\n`);

  // Check if identifier is a Mobile Number or Email
  const isMobile = /^[6-9]\d{9}$/.test(identifier);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

  if (isMobile) {
    await sendSMS(identifier, otp);
  } else if (isEmail) {
    await sendEmail(identifier, otp);
  }

  res.json({ success: true, message: 'OTP sent successfully!' });
});

// Route: Verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { identifier, otp } = req.body;
  const record = otpStore.get(identifier);

  if (!record) return res.status(400).json({ error: 'No OTP requested for this user' });
  if (Date.now() > record.expiresAt) {
    otpStore.delete(identifier);
    return res.status(400).json({ error: 'OTP has expired' });
  }
  if (record.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP entered' });
  }

  otpStore.delete(identifier);
  const token = jwt.sign({ user: identifier }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ success: true, token, message: 'Authentication successful!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));