import { Hono } from "hono";
import Template from "../models/template";
// import type { TemplateInput } from "../types/slide";
import { randomUUID } from "node:crypto";
import { requireAuth } from '@/middleware/auth.middleware'

const templateRoutes = new Hono();
export default templateRoutes;

// POST /api/templates - create template
templateRoutes.post('/',requireAuth, async (c) => {
  try {
    // ✅ 1. Parse form data
    const formData = await c.req.formData()
    const data = formData.get('data')
    const images = formData.getAll('images') as File[]

    if (!data) {
      return c.json({ error: 'Missing template data' }, 400)
    }

    // ✅ 2. Parse JSON safely
    let templateData
    try {
      templateData = JSON.parse(data as string)
    } catch (err) {
      return c.json({ error: 'Invalid JSON in "data"' }, 400)
    }

    const { name, layout, placeholders, theme } = templateData

    if (!name || !layout || !Array.isArray(placeholders)) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // ✅ 3. Save uploaded images (example: save to public/uploads)
    const uploadedUrls: Record<string, string> = {}

    for (const image of images) {
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const filename = `${randomUUID()}.jpg`
      const filepath = `public/uploads/${filename}`

      // Save file (ensure `public/uploads` exists)
      await Bun.write(filepath, buffer)

      uploadedUrls[image.name] = `/uploads/${filename}`
    }

    // ✅ 4. Replace placeholder URLs with uploaded ones
    const finalPlaceholders = placeholders.map((block: any) => {
      if (
        block.type === 'image' &&
        block.content?.url &&
        uploadedUrls[block.content.url.split('/').pop()]
      ) {
        return {
          ...block,
          content: {
            url: uploadedUrls[block.content.url.split('/').pop()],
          },
        }
      }
      return block
    })

    // ✅ 5. Save to DB
    const created = await Template.create({
      name,
      layout,
      placeholders: finalPlaceholders,
      theme,
      createdAt: new Date(),
    })

    return c.json({ message: 'Template created', data: created }, 201)
  } catch (err: any) {
    console.error(err)
    return c.json({ error: 'Internal Server Error: ' + err.message }, 500)
  }
})

// PUT /api/templates/:id - update template
// templateRoutes.put("/:id", async (c) => {
//   const id = c.req.param("id");
//   // const body = await c.req.json<Partial<TemplateInput>>();

//   try {
//     // const updated = await Template.findByIdAndUpdate(id, body, { new: true });
//     if (!updated) return c.json({ error: "Template not found" }, 404);
//     return c.json({ message: "Template updated", data: updated });
//   } catch (err) {
//     console.error("Error updating template:", err);
//     return c.json({ error: "Update failed" }, 500);
//   }
// });

// GET /api/templates - list templates
templateRoutes.get("/", async (c) => {
  const templates = await Template.find({});
  return c.json(templates);
});
