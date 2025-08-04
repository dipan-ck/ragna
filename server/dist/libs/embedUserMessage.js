// libs/embedSingleText.ts
import { InferenceClient } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();
const client = new InferenceClient(process.env.HF_TOKEN);
export async function embedText(text) {
    try {
        const embedding = await client.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: text,
            provider: 'hf-inference',
        });
        return embedding;
    }
    catch (err) {
        console.error('Error generating embedding for text:', err);
        throw err;
    }
}
