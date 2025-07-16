// middlewares/rateLimiter.ts
import rateLimit from "express-rate-limit";

// 🚨 OTP and login routes - stricter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests. Try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// 🛡️ Update profile/email - moderate
export const updateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 10,
  message: "Too many update requests. Please wait.",
  standardHeaders: true,
  legacyHeaders: false,
});
