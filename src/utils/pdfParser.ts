import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Extracts readable text from PDF, DOCX, or PPTX files
 * @param buffer - The file content as a Buffer
 * @param mimeType - The MIME type of the file
 * @returns Promise<string> - Extracted text, or empty string on failure/unsupported type
 */
export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    switch (mimeType) {
      case "application/pdf": {
        const data = await pdfParse(buffer);
        return data.text?.trim() || "";
      }

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        const result = await mammoth.extractRawText({ buffer });
        return result.value?.trim() || "";
      }

      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        // TODO: Add PPTX support with a working library (e.g., 'node-pptx' or 'officegen')
        console.warn("PPTX parsing is not yet implemented");
        return "";

      default:
        console.warn(`Unsupported MIME type: ${mimeType}`);
        return "";
    }
  } catch (err) {
    console.error("File parse error:", err);
    return "";
  }
}