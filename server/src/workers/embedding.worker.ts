import { Worker } from "bullmq";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";

const connection = {
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT ?? 6379),
    maxRetriesPerRequest: null,
};

console.log("Workr started");

new Worker(
    "file-ingestion",
    async (job) => {
        const { fileId } = job.data;
        console.log("Processing file:", fileId);

        await prisma.file.update({
            where: { id: fileId },
            data: { status: "PROCESSING" },
        });

        try {
            // TODO
            // 1 download file from S3
            // 2 extract text
            // 3 chunk text
            // 4 generate embeddings
            // 5 store in Pinecone

            await prisma.file.update({
                where: { id: fileId },
                data: { status: "READY" },
            });
        } catch (error) {
            await prisma.file.update({
                where: { id: fileId },
                data: { status: "FAILED" },
            });
            throw error;
        }
    },
    { connection },
);
