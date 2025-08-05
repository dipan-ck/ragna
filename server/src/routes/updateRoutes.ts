import express, { Router } from 'express';
import verifyAuth from '../middlewares/verifyAuth.js';
import upload from '../libs/multer.js';
import { requestEmailUpdate, requestPasswordReset, updateFullName, updateProfileImage, verifyEmailUpdate, verifyPasswordReset } from '../controllers/updateController.js';
import { updateLimiter } from '../middlewares/rateLimiter.js';

const router: Router = express.Router();

router.patch('/avatar', verifyAuth, upload.single('avatar'),updateLimiter, updateProfileImage);
router.patch("/full-name", verifyAuth,updateLimiter, updateFullName);

router.post("/update-email/request",updateLimiter, verifyAuth, requestEmailUpdate);
router.post("/update-email/verify",updateLimiter, verifyAuth,  verifyEmailUpdate);

router.post("/update-password/request", updateLimiter, requestPasswordReset);
router.post("/update-password/verify",updateLimiter, verifyPasswordReset);

export default router;