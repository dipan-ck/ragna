// schemas/updateSchema.ts
import { z } from "zod";
export const updateFullNameSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
});
export const requestEmailUpdateSchema = z.object({
    email: z.string().email("Invalid email address"),
});
export const verifyEmailUpdateSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});
export const requestPasswordResetSchema = z.object({
    email: z.string().email("Invalid email address"),
});
export const verifyPasswordResetSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});
