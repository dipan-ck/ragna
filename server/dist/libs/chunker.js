export default function chunkText(fullText) {
    const breakRegex = /(?<=[.?!])\s+/;
    const sentences = fullText.split(breakRegex);
    const chunks = [];
    let currentSentence = "";
    const MAX_CHUNK_SIZE = 1000;
    for (const sentence of sentences) {
        if ((currentSentence + sentence).length > MAX_CHUNK_SIZE) {
            chunks.push(currentSentence.trim());
            currentSentence = sentence;
        }
        else {
            currentSentence += sentence + " ";
        }
    }
    if (currentSentence.trim().length > 0) {
        chunks.push(currentSentence.trim());
    }
    return chunks;
}
