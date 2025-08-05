import { Request, Response } from 'express';
import { UpdateEmailOtp } from '../models/UpdateEmailOtp.js';
import generateOTP from '../libs/generateOTP.js';
import sendOtpEmail from '../libs/sendEmail.js';
import User from '../models/User.js';
import { UpdatePasswordOtp } from '../models/UpdatePasswordOtp.js';
import bcrypt from 'bcrypt';
import {
  updateFullNameSchema,
  requestEmailUpdateSchema,
  verifyEmailUpdateSchema,
  requestPasswordResetSchema,
  verifyPasswordResetSchema,
} from "../schemas/updateSchema.js"


export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!(req as any).file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const imageUrl = (req as any).file.path; // Cloudinary gives this URL

    // ✅ Update image in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile image updated',
      data: {
        avatar: updatedUser.avatar
      }
    });
  } catch (err) {
    console.error('Image upload error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


export async function updateFullName(req: Request, res: Response){

const userId = (req as any).user?.id;

  const parse = updateFullNameSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Invalid full name", errors: parse.error.errors });
  }
  const { fullName } = parse.data;

  try{

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName },
        { new: true }
      );

      if(!updatedUser){
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Full name updated',
        data: {
          fullName: updatedUser.fullName
        }
      });

  }catch(error){
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }

}





export async function requestEmailUpdate(req: Request, res: Response): Promise<Response> {
  if (!(req as any).user || !(req as any).user.id) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const parse = requestEmailUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, message: 'Invalid email', errors: parse.error.errors });
  }

  const { email } = parse.data;
  const userId = (req as any).user?.id;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await UpdateEmailOtp.create({
      email,
      otp,
      userId,
      expiresAt,
    });

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to new email address. Please verify.',
    });
  } catch (error) {
    console.error('OTP Email Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
  }
}


export async function verifyEmailUpdate(req: Request, res: Response): Promise<Response> {
  if (!(req as any).user || !(req as any).user.id) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const parse = verifyEmailUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, message: 'Invalid input', errors: parse.error.errors });
  }

  const { email, otp } = parse.data;
  const userId = (req as any).user?.id;

  try {
    const otpRecord = await UpdateEmailOtp.findOne({
      email,
      otp,
      userId,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email },
      { new: true, select: 'email' }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await UpdateEmailOtp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      message: 'Email updated successfully',
      data: { email: updatedUser.email },
    });
  } catch (error) {
    console.error('Email Update Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update email' });
  }
}


export async function requestPasswordReset(req: Request, res: Response): Promise<Response> {

  const parse = requestPasswordResetSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, message: 'Invalid email', errors: parse.error.errors });
  }

  const { email } = parse.data;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in database
    await UpdatePasswordOtp.create({
      email,
      otp,
      userId: user._id,
      expiresAt,
    });

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify.',
    });
  } catch (error) {
    console.error('Password Reset OTP Email Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
  }
}



export async function verifyPasswordReset(req: Request, res: Response): Promise<Response> {
  const parse = verifyPasswordResetSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, message: 'Invalid input', errors: parse.error.errors });
  }

  const { email, otp, newPassword } = parse.data;

  try {
    const otpRecord = await UpdatePasswordOtp.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() }, 
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP record after successful verification
    await UpdatePasswordOtp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully.',
    });
  } catch (error) {
    console.error('Password Reset Verification Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
}