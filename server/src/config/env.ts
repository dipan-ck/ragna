import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    DEV_USER_ID: process.env.DEV_USER_ID!,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: Number(process.env.REDIS_PORT!),
    AWS_REGION: process.env.AWS_REGION!,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME!,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY!,
    PINECONE_INDEX: process.env.PINECONE_INDEX!,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
};
