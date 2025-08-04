


export default  function chunkText(fullText: string): string[] {
  const breakRegex = /(?<=[.?!])\s+/;
  const sentences : string[] = fullText.split(breakRegex);
  const chunks: string[] = [];
  let currentSentence : string = "";
  const MAX_CHUNK_SIZE : number = 1000;

  for (const sentence of sentences) {
    if ((currentSentence + sentence).length > MAX_CHUNK_SIZE) {
      chunks.push(currentSentence.trim());
      currentSentence = sentence;
    } else {
      currentSentence += sentence + " ";
    }
  }


  if (currentSentence.trim().length > 0) {
    chunks.push(currentSentence.trim());
  }

  return chunks;
}
