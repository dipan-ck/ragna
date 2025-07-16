import express, { Router } from 'express';
import { googleAuth, loginUser, logOutUser, registerUser, resendOTP, verifyOTP } from '../controllers/authController';
import { authLimiter } from 'middlewares/rateLimiter';

const router: Router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login',authLimiter, loginUser);
router.post("/verify-otp",authLimiter, verifyOTP);
router.get("/logout",authLimiter, logOutUser);
router.post("/resend-otp",authLimiter, resendOTP);
router.post("/google",authLimiter, googleAuth);

export default router;

