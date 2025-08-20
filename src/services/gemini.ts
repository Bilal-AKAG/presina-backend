import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateOutlineFromText(text: string, numSlides: number = 5) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Enforce a reasonable range
  const slideCount = Math.max(1, Math.min(numSlides, 20)); // Limit to 1–20 slides

  const prompt = `
Create a clear and engaging presentation outline with exactly ${slideCount} slide(s).
Use the input content to structure logical sections, but do not exceed ${slideCount} slides.

Return **only** a valid JSON object in this exact format:
{
  "slides": [
    {
      "title": "Slide Title",
      "points": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}

Each slide should have:
- A concise, impactful title
- 3 to 5 short bullet points (keep them brief and readable)

⚠️ Rules:
- Return ONLY the JSON object.
- No extra text, explanations, or markdown outside the JSON.
- Do not include any properties other than "title" and "points".
- Ensure the JSON is valid and parseable.
- Exactly ${slideCount} slide(s).

Input Content:
"""${text.trim().substring(0, 10000)}"""
`;

  const result = await model.generateContent([prompt]);
  const response = await result.response;
  let jsonText = response.text();

  if (!jsonText) {
    throw new Error("Gemini returned empty response");
  }

  // Remove markdown code block wrappers (```json ... ```)
  jsonText = jsonText.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

  try {
    const parsed = JSON.parse(jsonText);

    // Validate structure
    if (!Array.isArray(parsed.slides)) {
      throw new Error("Invalid format: expected 'slides' array");
    }

    // Enforce exact number of slides (optional: AI may not always obey)
    return {
      slides: parsed.slides.slice(0, slideCount), // Truncate if needed
    };
  } catch (err) {
    console.error("Gemini raw output:", jsonText);
    console.error("JSON parse error:", err);
    throw new Error("AI did not return a valid presentation outline. Please try again.");
  }
}


import type { SlideData } from "@/types/slide.ts"; 


export async function generateSlideFromOutline(
  outline: any,
  numSlides: number = 5
): Promise<{ slides: SlideData[] }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const slideCount = Math.max(1, Math.min(numSlides, 20))

  // ✅ Convert outline to string
  let outlineText = ''
  if (typeof outline === 'string') {
    outlineText = outline
  } else if (Array.isArray(outline)) {
    outlineText = outline
      .map(
        (slide) =>
          `Title: ${slide.title}\nPoints: ${slide.points?.join(', ') || 'None'}`
      )
      .join('\n\n')
  } else if (typeof outline === 'object' && outline.title) {
    // ✅ Handle single slide object
    outlineText = `Title: ${outline.title}\nPoints: ${outline.points?.join(', ') || 'None'}`
  } else {
    outlineText = JSON.stringify(outline).slice(0, 1000)
  }

  const prompt = `
Create a presentation with exactly ${slideCount} slides.
Each slide must match ONE of these types ONLY:
- "title" (big heading, optional subtitle)
- "bullet" (heading + bullet points)
- "image-text" (image URL + heading + text paragraph)
- "title-content" (heading + descriptive content)
- "two-column" (two-column layout with left and right titles and content)
- "quote" (quote text + optional author)
- "chart" (chart title + array of { name: string, value: number })

Return ONLY valid JSON in this exact format:
{
  "slides": [
    {
      "type": "title",
      "title": "Welcome to Our AI Presentation",
      "subtitle": "Generated instantly"
    },
    {
      "type": "bullet",
      "title": "Key Points",
      "bullets": ["Point 1", "Point 2", "Point 3"]
    },
    {
      "type": "image-text",
      "image": "https://picsum.photos/seed/vision/800/600.webp?grayscale&blur=2",
      "heading": "Our Vision",
      "text": "A short descriptive paragraph."
    }
  ]
}

Rules:
- One type per slide, no mixing.
- Use ONLY image URLs in this format:
  https://picsum.photos/seed/{seed}/{width}/{height}.webp?grayscale&blur=2
  where {seed} is based on the slide title (no spaces in seed).
- Return ONLY JSON — no markdown or extra text.
- Exactly ${slideCount} slides.
- Use the outline below to guide content:

Outline:
"""${outlineText.substring(0, 10000)}"""
`

  try {
    const result = await model.generateContent([prompt])
    const response = result.response
    let jsonText = response.text()

    if (!jsonText) throw new Error('Gemini returned empty response')

    // ✅ Clean code block
    jsonText = jsonText
      .trim()
      .replace(/^```(?:json)?/i, '')
      .replace(/```$/, '')
      .trim()

    const parsed = JSON.parse(jsonText) as { slides: SlideData[] }

    if (!Array.isArray(parsed.slides)) {
      throw new Error('Invalid format: expected "slides" array')
    }

    // ✅ Fix image URLs: remove spaces, enforce format
    parsed.slides.forEach((slide) => {
      if (slide.image) {
        const seed = encodeURIComponent(
          slide.heading || slide.title || 'slide'
        )
        // 🔥 FIX: No extra spaces!
        slide.image = `https://picsum.photos/seed/${seed}/800/600.webp?grayscale&blur=2`
      }
    })

    return { slides: parsed.slides.slice(0, slideCount) }
  } catch (err) {
    // console.error('Gemini raw output:', jsonText)
    console.error('JSON parse error:', err)
    throw new Error('AI did not return valid structured slides. Try again.')
  }
}
