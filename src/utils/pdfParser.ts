import pdfParse from "pdf-parse";
import mammoth from "mammoth";
// import pptx2json from "pptx2json";

/**
 * Extracts readable text from PDF, DOCX, or PPTX files
 */
export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === "application/pdf") {
      const data = await pdfParse(buffer);
      return data.text;
    }

    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    // if (mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
    //   const result = await pptx2json(buffer);
    //   const slideTexts = result.slides.map((slide: any) =>
    //     slide.texts.map((textObj: any) => textObj.text).join(" ")
    //   );
    //   return slideTexts.join("\n");
    // }

    return "";
  } catch (err) {
    console.error("File parse error:", err);
    return "";
  }
}
