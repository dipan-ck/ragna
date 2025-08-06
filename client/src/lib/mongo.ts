// lib/mongo.ts
import mongoose from 'mongoose';

const connectMongoDB = async (): Promise<void> => {
  try {
    // If already connected, return early
    if (mongoose.connections[0].readyState) {
      console.log('✅ Already connected to MongoDB');
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectMongoDB;
