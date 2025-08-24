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
import { requireAuth } from '@/middleware/auth.middleware'

export const outlineRoutes = new Hono();

// POST /api/outline
outlineRoutes.post("/outline", requireAuth,async (c) => {
  const formData = await c.req.formData()
  const file = formData.get("file") as File | null
  const prompt = (formData.get("prompt") as string) || ""
  let numSlides = parseInt((formData.get("num_slides") as string) || "5", 10) // Default to 5 if not provided

  // Validate num_slides
  const allowedSlides = [1, 3, 5, 10]
  if (!allowedSlides.includes(numSlides)) {
    return c.json(
      { error: `Invalid number of slides. Allowed: ${allowedSlides.join(', ')}` },
      400
    )
  }

  let text = prompt

  // Extract text from file if provided
  if (file) {
    try {
      
        text = text ? `${text}\n\n${extracted}`.trim() : extracted.trim()
      } else if (!text) {
        return c.json({ error: "No readable content found in the file." }, 400)
      }
    } catch (err) {
      console.error("File processing error:", err)
      return c.json({ error: "Failed to process file." }, 400)
    }
  }

  // Final validation
  if (!text || text.length < 10) {
    return c.json({ error: "Please provide a prompt or a file with meaningful content." }, 400)
  }

  // Generate outline with requested number of slides
  const outline = await generateOutlineFromText(text, numSlides) // ← Pass numSlides here

  // Save to DB
  const saved = await Outline.create({
    source: text,
    slides: outline.slides,
    numSlides,
  })

  // Return only the slides array
  return c.json({ slides: saved.slides, _id: saved._id.toString(),numSlides},200) 
})


// PUT /api/slides/:id
outlineRoutes.put('/outline/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()

  const updated = await Outline.findByIdAndUpdate(
    id,
    { slides: body.slides },
    { new: true }
  )

  if (!updated) return c.json({ error: 'Not found' }, 404)

  return c.json({ message: 'Updated', slides: updated.slides })
})

