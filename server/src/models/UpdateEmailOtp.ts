import mongoose, { Schema, Document } from 'mongoose';

// Interface for UpdateEmailOtp document
interface IUpdateEmailOtp extends Document {
  email: string;
  otp: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
}



const updateEmailOtpSchema = new Schema<IUpdateEmailOtp>({
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true, index: { expires: '5m' } }, // TTL index to auto-delete after 5 minutes
  });



export const UpdateEmailOtp = mongoose.model<IUpdateEmailOtp>('UpdateEmailOtp', updateEmailOtpSchema);