// schemas/authSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6)
});

export const resendOtpSchema = z.object({
  email: z.string().email()
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(10)
});
