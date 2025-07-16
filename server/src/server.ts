import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectMongoDB from './config/connectMongoDB';
import authRoutes from './routes/authRoutes';
import updateRoutes from "./routes/updateRoutes"
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); 
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/user", updateRoutes)

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to DB
connectMongoDB();
