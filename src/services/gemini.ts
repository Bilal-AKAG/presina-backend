import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateOutlineFromText(text: string, numSlides: number = 5) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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