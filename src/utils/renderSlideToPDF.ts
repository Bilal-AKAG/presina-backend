import { PDFPage, PDFDocument, rgb, StandardFonts } from 'pdf-lib'

interface Slide {
  type: string
  title?: string
  subtitle?: string
  heading?: string
  text?: string
  bullets?: string[]
  image?: string
  imagePosition?: 'left' | 'right'
  quote?: string
  author?: string
  chart?: {
    title?: string
    data: { name: string; value: number }[]
  }
  leftTitle?: string
  leftContent?: string
  rightTitle?: string
  rightContent?: string
}

export async function renderSlideToPDF(
  slide: Slide,
  page: PDFPage,
  pdfDoc: PDFDocument,
  fonts: { font: any; boldFont: any }
) {
  const { font, boldFont } = fonts
  const { width, height } = page.getSize()
  let y = height - 50

  // Title or Heading
  const title = slide.title || slide.heading
  if (title) {
    page.drawText(title, {
      x: 50,
      y,
      size: 24,
      font: boldFont,
      color: rgb(0, 0.5, 1),
    })
    y -= 40
  }

  // Subtitle or Text
  const subtitle = slide.subtitle || slide.text
  if (subtitle) {
    page.drawText(subtitle, {
      x: 50,
      y,
      size: 16,
      font,
      color: rgb(0, 0, 0),
      maxWidth: 500,
    })
    y -= 30
  }

  // Bullet Slide
  if (slide.type === 'bullet' && slide.bullets?.length) {
    for (const bullet of slide.bullets) {
      if (y < 50) {
        page = pdfDoc.addPage([600, 800])
        y = 750
      }
      page.drawText('• ' + bullet, {
        x: 70,
        y,
        size: 14,
        font,
        color: rgb(0, 0, 0),
      })
      y -= 25
    }
  }

  // Title-Content Slide
  if (slide.type === 'title-content' && slide.text) {
    page.drawText(slide.text, {
      x: 50,
      y,
      size: 14,
      font,
      color: rgb(0, 0, 0),
      maxWidth: 500,
    })
    y -= 100
  }

  // Two-Column Slide
  if (slide.type === 'two-column') {
    page.drawText(slide.leftTitle ?? '', {
      x: 50,
      y,
      size: 16,
      font: boldFont,
    })
    page.drawText(slide.leftContent ?? '', {
      x: 50,
      y: y - 25,
      size: 12,
      font,
      maxWidth: 200,
    })
    page.drawText(slide.rightTitle ?? '', {
      x: 300,
      y,
      size: 16,
      font: boldFont,
    })
    page.drawText(slide.rightContent ?? '', {
      x: 300,
      y: y - 25,
      size: 12,
      font,
      maxWidth: 200,
    })
    y -= 100
  }

  // Quote Slide
  if (slide.type === 'quote') {
    page.drawText(`"${slide.quote ?? ''}"`, {
      x: 50,
      y,
      size: 18,
      font,
      color: rgb(0.2, 0.2, 0.2),
      maxWidth: 500,
    })
    y -= 40
    if (slide.author) {
      page.drawText(`— ${slide.author}`, {
        x: 50,
        y,
        size: 14,
        font,
        color: rgb(0.4, 0.4, 0.4),
      })
      y -= 30
    }
  }

  // Chart Slide
  if (slide.type === 'chart' && slide.chart?.data?.length) {
    page.drawText(slide.chart.title ?? 'Chart', {
      x: 50,
      y,
      size: 16,
      font: boldFont,
    })
    y -= 30
    for (const item of slide.chart.data) {
      page.drawText(`${item.name}: ${item.value}`, {
        x: 70,
        y,
        size: 14,
        font,
      })
      y -= 20
    }
  }

  // Image Slide
  if (slide.image) {
    try {
      const res = await fetch(slide.image)
      const arrayBuffer = await res.arrayBuffer()
      let img
      try {
        img = await pdfDoc.embedPng(arrayBuffer)
      } catch {
        img = await pdfDoc.embedJpg(arrayBuffer)
      }

      if (y < 250) {
        page = pdfDoc.addPage([600, 800])
        y = 750
      }

      page.drawImage(img, {
        x: 50,
        y: y - 200 - 20,
        width: 200,
        height: 200,
      })

      y -= 240
    } catch (err) {
      page.drawText('(Image failed to load)', {
        x: 50,
        y,
        size: 14,
        font,
        color: rgb(0.5, 0.5, 0.5),
      })
      y -= 20
    }
  }
}
