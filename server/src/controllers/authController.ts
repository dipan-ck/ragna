import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import OtpVerification from "../models/OtpVerification.js";
import generateOTP from "../libs/generateOTP.js";
import generateToken from "../libs/generateToken.js";
import sendOtpEmail from "../libs/sendEmail.js";
import { OAuth2Client } from 'google-auth-library';
import { registerSchema, loginSchema, otpSchema, resendOtpSchema, googleAuthSchema } from "../schemas/authSchema.js";


export async function registerUser(req: Request,res: Response): Promise<Response> {


const parse = registerSchema.safeParse(req.body);

if (!parse.success) {
  console.log("Validation error:", parse.error.format()); // this is much more readable
  return res.status(400).json({ success: false, message: "Invalid input", errors: parse.error.errors });
}
   
  const { email, password, fullName } = parse.data;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
    });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await OtpVerification.create({
      email: user.email,
      otp,
      expiresAt,
    });

    await sendOtpEmail(user.email, otp);

    return res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export async function loginUser(
  req: Request,
  res: Response
): Promise<Response> {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, message: "Invalid input", errors: parse.error.errors });
  }

  const { email, password } = parse.data;
  try {
    const user = await User.findOne({ email });
    if (!user || user.isVerified == false) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export async function logOutUser(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
}

export async function verifyOTP(req: Request, res: Response) {
  const parse = otpSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, message: "Invalid input", errors: parse.error.errors });
  }

  const { email, otp } = parse.data;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const otpVerification = await OtpVerification.findOne({ email });
    if (!otpVerification) {
      return res
        .status(400)
        .json({ success: false, message: "OTP does not exist" });
    }

    // Check OTP expiration
    if (otpVerification.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // Check if OTP matches
    if (parseInt(otp) !== parseInt(otpVerification.otp)) {
      return res
        .status(400)
        .json({ success: false, message: "OTP does not match" });
    }

    // Update user as verified
    user.isVerified = true;
    await user.save();

    // Delete OTP document after verification
    await OtpVerification.deleteOne({ email });

    // Generate JWT and set cookie
    const token = generateToken(user._id.toString());
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export async function resendOTP(req: Request, res: Response) {
  const parse = resendOtpSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, message: "Invalid email", errors: parse.error.errors });
  }

  const { email } = parse.data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    // Remove any previous OTPs
    await OtpVerification.deleteMany({ email });

    // Generate and save new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const newOtp = await OtpVerification.create({
      email,
      otp,
      expiresAt,
    });

    await newOtp.save();
    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}




export async function googleAuth(req: Request, res: Response) {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET, 
    'postmessage'
  );

  
  const { authCode } = req.body;

 
  if (!authCode || typeof authCode !== 'string' || authCode.trim() === '') {
    return res.status(400).json({ success: false, message: "Invalid authorization code provided." });
  }

  try {
   
    const { tokens } = await client.getToken(authCode);

 
    const idToken = tokens.id_token;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'No ID token received from Google after exchange.' });
    }


    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name) {
      return res.status(400).json({ success: false, message: 'Invalid token payload or missing data.' });
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        isVerified: true, 
        password: '',     
        avatar: picture,
        isOAuth: true
      });
    }

  
    const token = generateToken(user._id.toString());

  
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({ success: true, message: 'Logged in Successfully' });

  } catch (err: any) {
    console.error("Google authentication error:", err.message);
    let errorMessage = 'Google authentication failed';
    if (err.message.includes('invalid_grant')) {
        errorMessage = 'Invalid authorization code or code already used. Please try again.';
    } else if (err.code === 400 && err.errors && Array.isArray(err.errors)) {
      // This part might still be relevant if Google's API returns specific errors
      errorMessage = err.errors[0].message || errorMessage;
    }
    return res.status(401).json({ success: false, message: errorMessage });
  }
}


export async function validateUser(req : Request, res: Response){
  const userId = (req as any).user?.id;

  try{

    const user = await User.findById(userId);

    if(!user){
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    return res.status(200).json({ success: true, message: "User is valid", data: {
      email: user.email,
      fullName: user.fullName,
      isVerified: user.isVerified,
      avatar: user.avatar,
      usage : user.usage,
      subscriptionStatus: user.subscriptionStatus,
      plan: user.plan
    } });



  }catch(error){
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }

}