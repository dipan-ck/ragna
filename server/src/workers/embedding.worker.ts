import { Worker } from "bullmq";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { getPineconeIndex } from "../lib/pinecone.js";
import { extractText } from "../lib/textExtractors.js";
import { embedChunks } from "../lib/embedderModel.js";
import { downloadFileFromS3 } from "../modules/files/file.service.js";

const connection = {
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT ?? 6379),
    maxRetriesPerRequest: null,
};

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
});

console.log("Worker started");

new Worker(
    "file-ingestion",
    async (job) => {
        const { fileId } = job.data;
        console.log("Processing file:", fileId);

        try {
            await prisma.file.update({
                where: { id: fileId },
                data: { status: "PROCESSING" },
            });

            const file = await prisma.file.findUnique({
                where: { id: fileId },
                select: { projectId: true, s3Key: true, mimeType: true },
            });
            if (!file) throw new Error(`File ${fileId} not found`);

            // 1. download from S3
            const buffer = await downloadFileFromS3(file.s3Key);

            // 2. extract text
            const text = await extractText(buffer, file.mimeType!);

            // 3. chunk text
            const chunks = await splitter.splitText(text);

            // 4. generate embeddings
            const embeddings = await embedChunks(chunks);

            // 5. store in pinecone
            const index = getPineconeIndex().namespace(file.projectId);
            await index.upsert({
                records: chunks.map((text, i) => ({
                    id: `${fileId}-chunk-${i}`,
                    values: embeddings[i],
                    metadata: { fileId, text },
                })),
            });

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
