import { Hono } from "hono";
import Template from "../models/template";
import type { TemplateInput } from "../types/templates";

const templateRoutes = new Hono();
export default templateRoutes;

// POST /api/templates - create template
templateRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json();

    const { name, layout, placeholders } = body;

    if (!name || !layout || !Array.isArray(placeholders)) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const created = await Template.create({
      name,
      layout,
      placeholders,
      createdAt: new Date(),
    });

    return c.json({ message: 'Template created', data: created }, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// PUT /api/templates/:id - update template
templateRoutes.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<Partial<TemplateInput>>();

  try {
    const updated = await Template.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return c.json({ error: "Template not found" }, 404);
    return c.json({ message: "Template updated", data: updated });
  } catch (err) {
    console.error("Error updating template:", err);
    return c.json({ error: "Update failed" }, 500);
  }
});

// GET /api/templates - list templates
templateRoutes.get("/", async (c) => {
  const templates = await Template.find({});
  return c.json(templates);
});
