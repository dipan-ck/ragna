import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectMongoDB from './config/connectMongoDB';
import authRoutes from './routes/authRoutes';
import fileRoutes from "./routes/fileRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import notoficationRoutes from "./routes/notificationRoutes";
import projectRoutes from "./routes/projectRoutes";
import updateRoutes from "./routes/updateRoutes";
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true // if you're using cookies
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
