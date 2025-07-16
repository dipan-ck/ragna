import express, { Router } from 'express';
import verifyAuth from 'middlewares/verifyAuth';
import upload from 'libs/multer';
import { requestEmailUpdate, requestPasswordReset, updateFullName, updateProfileImage, verifyEmailUpdate, verifyPasswordReset } from 'controllers/updateController';
import { updateLimiter } from 'middlewares/rateLimiter';

const router: Router = express.Router();

router.patch('/avatar', verifyAuth, upload.single('avatar'),updateLimiter, updateProfileImage);
router.patch("/full-name", verifyAuth,updateLimiter, updateFullName);

router.post("/update-email/request",updateLimiter, requestEmailUpdate);
router.post("/update-email/verify",updateLimiter, verifyEmailUpdate);

router.post("/update-password/request", updateLimiter, requestPasswordReset);
router.post("/update-password/verify",updateLimiter, verifyPasswordReset);

export default router;