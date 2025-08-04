// libs/embedAndStoreChunks.ts
import { InferenceClient} from "@huggingface/inference";
import chunkText from "./chunker";
import { pineconeIndex } from "config/PineconeClient";
import { PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import dotenv from 'dotenv';

dotenv.config();

const client = new InferenceClient(process.env.HF_TOKEN!);

async function returnVectorObject(chunk: string, params: {
  namespace: string;
  fileId: string;
  projectId: string;
  userId: string;
  index: number;
}): Promise<PineconeRecord<RecordMetadata>> {
  try {  
    const embedding = await client.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: chunk,
      provider: "hf-inference"
    });

    return {
      id: `chunk_${params.fileId}_${params.index}`,
      values: Array.from(embedding) as number[],
      metadata: {
        fileId: params.fileId,
        projectId: params.projectId,
        userId: params.userId,
        chunkIndex: params.index,
        content: chunk,
      },
    };
  } catch (err) {
    console.error("Error getting embedding:", err);
    throw err;
  }
}

export async function embedAndStoreChunks(
  rawText: string,
  {
    namespace,
    fileId,
    projectId,
    userId,
  }: { namespace: string; fileId: string; projectId: string; userId: string }
) {
  const chunks = chunkText(rawText);

  const vectors = await Promise.all(
    chunks.map((chunk, index) =>
      returnVectorObject(chunk, {
        namespace,
        fileId,
        projectId,
        userId,
        index,
      })
    )
  );

  await pineconeIndex.namespace(namespace).upsert(vectors);
}
