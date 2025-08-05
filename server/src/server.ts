
import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import connectMongoDB from './config/connectMongoDB.js';
import authRoutes from './routes/authRoutes.js';
import fileRoutes from "./routes/fileRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js"
import notoficationRoutes from "./routes/notificationRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import updateRoutes from "./routes/updateRoutes.js"
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';



const app: Application = express();

const allowedOrigins = ['http://localhost:3000', 'https://your-production-frontend.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));


// Middleware
app.use(express.json());
app.use(cookieParser()); 
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/user", updateRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notification", notoficationRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to DB
connectMongoDB();
