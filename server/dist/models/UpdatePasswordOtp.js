import mongoose, { Schema } from 'mongoose';
// Schema for UpdatePasswordOtp
const updatePasswordOtpSchema = new Schema({
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true, index: { expires: '5m' } }, // TTL index to auto-delete after 5 minutes
});
export const UpdatePasswordOtp = mongoose.model('UpdatePasswordOtp', updatePasswordOtpSchema);
