import { Request, Response } from 'express';
import generateOTP from 'libs/generateOTP';
import sendOtpEmail from 'libs/sendEmail';
import User from 'models/User';
import bcrypt from 'bcrypt';
import {
  updateFullNameSchema,
  requestEmailUpdateSchema,
  verifyEmailUpdateSchema,
  requestPasswordResetSchema,
  verifyPasswordResetSchema,
} from "schemas/updateSchema";


export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; 

    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const imageUrl = req.file.path; // Cloudinary gives this URL

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

 const userId = req.user?.id;

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



const otpMap = new Map<string, string>();

export async function requestEmailUpdate(req: Request, res: Response) {
 const parse = requestEmailUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Invalid email", errors: parse.error.errors });
  }

  const { email } = parse.data;

  try {
    // Check if this email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Generate and store OTP
    const otp = generateOTP();
    otpMap.set(email, otp);

    // Send email
    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to new email address. Please verify.",
    });
  } catch (error) {
    console.error("OTP Email Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function verifyEmailUpdate(req: Request, res: Response) {
 const parse = verifyEmailUpdateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Invalid input", errors: parse.error.errors });
  }
  const { email, otp } = parse.data;

  const storedOtp = otpMap.get(email);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { email }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    otpMap.delete(email);

    return res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: { email: updatedUser.email },
    });
  } catch (error) {
    console.error("Email update error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}


export async function requestPasswordReset(req: Request, res: Response) {

  const parse = requestPasswordResetSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Invalid email", errors: parse.error.errors });
  }
  const { email } = parse.data;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const otp = generateOTP();
  otpMap.set(email, otp);

  await sendOtpEmail(email, otp);

  return res.status(200).json({
    success: true,
    message: "OTP sent to your email. Please verify.",
  });
}


export async function verifyPasswordReset(req: Request, res: Response) {


  const parse = verifyPasswordResetSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: "Invalid input", errors: parse.error.errors });
  }
  const { email, otp, newPassword } = parse.data;

  const storedOtp = otpMap.get(email);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  otpMap.delete(email);

  return res.status(200).json({
    success: true,
    message: "Password has been reset successfully.",
  });
}