import mongoose, { Schema } from 'mongoose';
const updateEmailOtpSchema = new Schema({
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true, index: { expires: '5m' } }, // TTL index to auto-delete after 5 minutes
});
export const UpdateEmailOtp = mongoose.model('UpdateEmailOtp', updateEmailOtpSchema);
