import { Hono } from 'hono'
import pptxgen from 'pptxgenjs'
import { streamToBlob } from 'bun'

const slidesRoutes = new Hono()

slidesRoutes.post('/generate-ppt', async (c) => {
  const { slides } = await c.req.json()

  if (!slides || !Array.isArray(slides)) {
    return c.json({ error: 'Invalid slide content' }, 400)
  }

  const pptx = new pptxgen()

  slides.forEach((slideData: { title: string; content: string }) => {
    const slide = pptx.addSlide()
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.5,
      fontSize: 24,
      bold: true
    })
    slide.addText(slideData.content, {
      x: 0.5,
      y: 1.5,
      fontSize: 18,
      color: '363636',
      lineSpacingMultiple: 1.2
    })
  })

  // Export to stream and return as response
  const buffer = await pptx.write('nodebuffer')

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': 'attachment; filename="presentation.pptx"',
    }
  })
})

export default slidesRoutes
