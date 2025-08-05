import { Hono } from "hono";
import { extractTextFromFile } from "../utils/pdfParser";
import { generateOutlineFromText } from "../services/gemini";
import Outline from "../models/outline";

export const outlineRoutes = new Hono();

outlineRoutes.post("/outline", async (c) => {
  
  const formData = await c.req.formData();
  const file = formData.get("file") as File;
  const prompt = formData.get("prompt") as string || "";

  let text = prompt;

  if (file) {
    const buffer = await file.arrayBuffer();
    const mimeType = file.type;

    const extracted = await extractTextFromFile(Buffer.from(buffer), mimeType);

    if (extracted?.length > 10) {
      text = extracted;
    }
  }

  if (!text || text.length < 10) {
    return c.json({ error: "No valid content found in file or prompt." }, 400);
  }

  const outline = await generateOutlineFromText(text);
  const saved = await Outline.create({ source: text, slides: outline.slides });

  return c.json({ outline: saved.slides });

});

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

