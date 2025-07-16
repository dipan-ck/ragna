import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectMongoDB from './config/connectMongoDB';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to DB
connectMongoDB();
