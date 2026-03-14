import { Queue } from "bullmq";
import { env } from "../config/env.js";

export const embeddingQueue = new Queue("file-ingestion", {
    connection: {
        host: env.REDIS_HOST,
        port: Number(env.REDIS_PORT ?? 6379),
        maxRetriesPerRequest: null,
    },
});
