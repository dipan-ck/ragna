import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

const genai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export async function embedChunks(chunks: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (const chunk of chunks) {
        const result = await genai.models.embedContent({
            model: "gemini-embedding-exp-03-07",
            contents: chunk,
        });
        embeddings.push(result.embeddings![0].values!);
    }

    return embeddings;
}
