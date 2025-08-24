import { Hono } from "hono";
import { extractTextFromFile } from "../utils/pdfParser";
import { generateOutlineFromText } from "../services/gemini";
import Outline from "../models/outline";
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

