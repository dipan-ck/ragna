import { Queue } from "bullmq";
import { env } from "../config/env.js";

const connection = {
    url: env.UPSTASH_REDIS_URL,
    maxRetriesPerRequest: null,
};

export const embeddingQueue = new Queue("file-ingestion", { connection });
