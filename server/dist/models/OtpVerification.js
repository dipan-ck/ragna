import mongoose, { Schema } from 'mongoose';
const otpVerificationSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const OtpVerification = mongoose.model('OtpVerification', otpVerificationSchema);
export default OtpVerification;
