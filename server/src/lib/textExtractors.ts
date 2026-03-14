import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

export async function extractText(
    buffer: Buffer,
    mimeType: string,
): Promise<string> {
    switch (mimeType) {
        case "application/pdf": {
            const parser = new PDFParse({ data: buffer });
            const result = await parser.getText();
            return result.text;
        }
        case "application/msword":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        }
        case "application/vnd.ms-excel":
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
            const workbook = XLSX.read(buffer);
            return workbook.SheetNames.map((name) =>
                XLSX.utils.sheet_to_txt(workbook.Sheets[name]),
            ).join("\n");
        }
        case "text/markdown":
        case "text/x-markdown":
            return buffer.toString("utf-8");
        default:
            throw new Error(`Unsupported mimeType: ${mimeType}`);
    }
}
