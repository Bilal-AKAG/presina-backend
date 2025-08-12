import { Hono } from "hono";
import { extractTextFromFile } from "../utils/pdfParser";
import { generateOutlineFromText } from "../services/gemini";
import Outline from "../models/outline";

export const outlineRoutes = new Hono();

// POST /api/outline
outlineRoutes.post("/outline", async (c) => {
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
      const buffer = await file.arrayBuffer()
      const mimeType = file.type
      const extracted = await extractTextFromFile(Buffer.from(buffer), mimeType)

      if (extracted?.trim().length > 10) {
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
  return c.json({ outline: saved.slides })
})


// GET all presentations (outlines)
outlineRoutes.get('/outline', async (c) => {
  const presentations = await Outline.find().sort({ createdAt: -1 });
  return c.json(presentations);
});

// route: POST /api/slides
outlineRoutes.post('/slides', async (c) => {
  const body = await c.req.json();

  const outline = body.outline;

  if (!outline || !Array.isArray(outline)) {
    return c.json({ error: "Invalid outline format" }, 400);
  }

  const saved = await Outline.create({
    source: 'User edited',
    slides: outline,
    isConverted: true,
  });

  return c.json({
    message: "Slide converted successfully",
    slides: saved.slides,
  });
});



// PUT /api/slides/:id
outlineRoutes.put('/slides/:id', async (c) => {
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

