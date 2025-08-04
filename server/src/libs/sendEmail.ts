import nodemailer from 'nodemailer';
import dotenv from 'dotenv';



dotenv.config();

export default async function sendOtpEmail(email: string, otp: string): Promise<void> {
  // Create a Nodemailer transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
    },
  });



const mailOptions = {
  from: `"Dipan Chakraborty from Ragna" <${process.env.GMAIL_USER}>`,
  to: email,
  subject: 'Welcome to Ragna - Account Verification',
  text: `Your One-Time Password (OTP) is: ${otp}. It is valid for 5 minutes.`,
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .container {
            background-color: #f8f8f8;
            border-radius: 12px;
            padding: 35px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .otp-box {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
            border: 1px solid #e0e0e0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #333333;
            letter-spacing: 8px;
          }
          .footer {
            text-align: center;
            margin-top: 35px;
            padding-top: 25px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #666666;
          }
          .personal-note {
            font-style: italic;
            color: #444444;
            margin-bottom: 25px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 style="text-align: center; color: #333333;">Welcome to Ragna!</h2>
          <div class="personal-note">
            <p>Hey there!</p>
            <p>I'm Dipan Chakraborty, the creator of Ragna. I'm truly excited to have you join our community. I personally ensure that every user gets the best experience possible with our platform.</p>
          </div>
          <p>To get started with your journey, please use this verification code:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <p style="margin-top: 15px; color: #666666;">Valid for 5 minutes</p>
          </div>
          <p style="color: #ff4444;"><strong>Security Note:</strong> This code is for your eyes only. My team and I will never ask you for this code.</p>
          <div class="footer">
            <p>If this wasn't you, no worries - just ignore this email.</p>
            <p>Looking forward to having you onboard!</p>
            <p style="margin-top: 15px;">Best regards,<br>Dipan</p>
            <p style="margin-top: 20px;">© 2024 Ragna. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
};


  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}