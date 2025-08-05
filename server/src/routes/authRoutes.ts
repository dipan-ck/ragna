import express, { Router } from 'express';
import { googleAuth, loginUser, logOutUser, registerUser, resendOTP, validateUser, verifyOTP } from '../controllers/authController.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import verifyAuth from '../middlewares/verifyAuth.js';

const router: Router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login',authLimiter, loginUser);
router.post("/verify-otp",authLimiter, verifyOTP);
router.get("/logout",authLimiter, logOutUser);
router.post("/resend-otp",authLimiter, resendOTP);
router.post("/google",authLimiter, googleAuth);
router.get("/me", verifyAuth, validateUser);

export default router;

