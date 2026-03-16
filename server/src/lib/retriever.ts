import { getPineconeIndex } from "./pinecone.js";
import { embedQuery } from "./embedderModel.js";

export async function retrieveContext(
    query: string,
    projectId: string,
    topK = 6,
): Promise<string> {
    const vector = await embedQuery(query);
    const index = getPineconeIndex().namespace(projectId);

    const results = await index.query({
        vector,
        topK,
        includeMetadata: true,
    });

    return results.matches
        .filter((m) => m.score && m.score > 0.5)
        .map((m) => m.metadata?.text as string)
        .filter(Boolean)
        .join("\n\n---\n\n");
}
