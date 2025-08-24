// routes/export.ts
import { Hono } from 'hono'
import mongoose from 'mongoose'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { requireAuth } from '@/middleware/auth.middleware'
import Presentation from '@/models/presentation'
import { renderSlideToPDF } from '@/utils/renderSlideToPDF'

const exportRoutes = new Hono()

// ✅ Export as PPTX
exportRoutes.get('/pptx/:id', async (c) => {
  const { id } = c.req.param()

  // 📂 Fetch presentation
  let presentation

  if (id.startsWith('temp-')) {
    presentation = await Presentation.findOne({ tempId: id })
  } else {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return c.json({ error: 'Invalid ID format' }, 400)
    }
    presentation = await Presentation.findById(id)
  }

  if (!presentation) {
    return c.json({ error: 'Not found or unauthorized' }, 404)
  }

  // 📄 Generate PPTX
  const pptx = await import('pptxgenjs')
  const pres = new pptx.default() // ✅ Fix: use .default

  // Slide 1: Title
  const titleSlide = pres.addSlide()
  titleSlide.addText(presentation.title || 'Presentation', {
    x: 0.5,
    y: 1.0,
    fontSize: 44,
    bold: true,
  })
  titleSlide.addText('Generated with AI', {
    x: 0.5,
    y: 2.0,
    fontSize: 24,
    color: '666666',
  })

  // Add content slides
  for (const slide of presentation.slides) {
    const s = pres.addSlide()

    switch (slide.type) {
      case 'title':
        s.addText(slide.title || '', {
          x: 0.5,
          y: 1.0,
          fontSize: 44,
          bold: true,
        })
        if (slide.subtitle) {
          s.addText(slide.subtitle, {
            x: 0.5,
            y: 1.8,
            fontSize: 24,
            color: '666666',
          })
        }
        break

      case 'bullet':
        s.addText(slide.title || '', {
          x: 0.5,
          y: 0.5,
          fontSize: 36,
          bold: true,
        })
        slide.bullets?.forEach((b, i) => {
          s.addText(`• ${b}`, {
            x: 0.7,
            y: 1.2 + i * 0.3,
            fontSize: 18,
          })
        })
        break

      case 'image-text':
        s.addText(slide.heading || '', {
          x: 0.5,
          y: 0.5,
          fontSize: 36,
          bold: true,
        })
        s.addText(slide.text || '', {
          x: 0.5,
          y: 1.5,
          fontSize: 18,
          w: 9,
        })
        if (slide.image) {
          s.addImage({
            data: slide.image,
            type: 'image',
            x: 0.5,
            y: 2.5,
            w: 8,
            h: 4,
          })
        }
        break

      default:
        s.addText('Slide', {
          x: 0.5,
          y: 1.0,
          fontSize: 36,
        })
    }
  }

  // 📥 Return as downloadable file
  const buffer = await pres.write({ outputType: 'nodebuffer' })

  return new Response(buffer, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${presentation.title || 'presentation'}.pptx"`,
    },
  })
})

// ✅  PDF export

exportRoutes.get('/pdf/:id', async (c) => {
  const { id } = c.req.param()

  let presentation
  if (id.startsWith('temp-')) {
    presentation = await Presentation.findOne({ tempId: id })
  } else {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return c.json({ error: 'Invalid ID format' }, 400)
    }
    presentation = await Presentation.findById(id)
  }

  if (!presentation) {
    return c.json({ error: 'Presentation not found' }, 404)
  }

  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  for (const slide of presentation.slides) {
    const page = pdfDoc.addPage([600, 800])
    await renderSlideToPDF(slide, page, pdfDoc, { font, boldFont })
  }

  const pdfBytes = await pdfDoc.save()

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${presentation.title}.pdf"`,
    },
  })
})

export default exportRoutes
