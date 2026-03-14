import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "../config/env.js";

export const pinecone = new Pinecone({ apiKey: env.PINECONE_API_KEY });
export const getPineconeIndex = () =>
    pinecone.index({ name: env.PINECONE_INDEX });
