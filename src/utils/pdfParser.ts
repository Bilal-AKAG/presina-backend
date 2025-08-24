import PDFParser from "pdf2json";
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
        const pdfParser = new PDFParser();
        pdfParser.parseBuffer(buffer);

        return new Promise((resolve, reject) => {
          pdfParser.on('pdfParser_dataReady', (pdfData) => {
            // Extract text from all pages, decoding URI-encoded characters (e.g., %20 for spaces)
            const text = pdfData.Pages.flatMap(page =>
              page.Texts.map(textItem => decodeURIComponent(textItem.R[0].T))
            ).join(' ').trim();
            resolve(text || "");
          });
          pdfParser.on('error', (err) => {
            console.error("PDF parse error:", err);
            reject(err);
          });
        });
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