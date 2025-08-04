import mongoose, { Schema, Document } from 'mongoose';

interface IUpdatePasswordOtp extends Document {
    email: string;
    otp: string;
    userId: mongoose.Types.ObjectId;
    expiresAt: Date;
  }



  // Schema for UpdatePasswordOtp
const updatePasswordOtpSchema = new Schema<IUpdatePasswordOtp>({
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true, index: { expires: '5m' } }, // TTL index to auto-delete after 5 minutes
  });

  

  export const UpdatePasswordOtp = mongoose.model<IUpdatePasswordOtp>('UpdatePasswordOtp', updatePasswordOtpSchema);