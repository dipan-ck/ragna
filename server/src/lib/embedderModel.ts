import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

const genai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export async function embedChunks(chunks: string[]): Promise<number[][]> {
    const result = await genai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunks,
        config: { outputDimensionality: 1024 },
    });
    return result.embeddings!.map((e) => e.values!);
}

export async function embedQuery(query: string): Promise<number[]> {
    const result = await genai.models.embedContent({
        model: "gemini-embedding-001",
        contents: [query],
        config: { outputDimensionality: 1024 },
    });
    return result.embeddings![0].values!;
}
