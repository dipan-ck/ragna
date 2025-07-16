import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IOtpVerification extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const otpVerificationSchema: Schema<IOtpVerification> = new Schema({
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

const OtpVerification: Model<IOtpVerification> = mongoose.model<IOtpVerification>(
  'OtpVerification',
  otpVerificationSchema
);

export default OtpVerification;
