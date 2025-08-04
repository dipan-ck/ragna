import fs from "fs/promises";
import path from "path";
import os from "os";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
export async function loadTextFromBuffer(buffer, originalName) {
    if (!buffer || !originalName) {
        throw new Error("Missing buffer or filename");
    }
    const ext = path.extname(originalName).toLowerCase();
    const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${originalName}`);
    // ✅ Write buffer to a temp file
    await fs.writeFile(tempFilePath, buffer);
    let loader;
    switch (ext) {
        case ".pdf":
            loader = new PDFLoader(tempFilePath);
            break;
        case ".csv":
            loader = new CSVLoader(tempFilePath);
            break;
        case ".docx":
            loader = new DocxLoader(tempFilePath);
            break;
        default:
            throw new Error(`Unsupported file type: ${ext}`);
    }
    const docs = await loader.load();
    // Clean up temp file
    await fs.unlink(tempFilePath);
    const fullText = docs.map((doc) => doc.pageContent).join("\n");
    return fullText;
}
