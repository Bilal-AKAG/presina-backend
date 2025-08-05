import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateOutlineFromText(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    `Create a presentation outline from the following input.
Return **only** valid JSON in the format:
{
  "slides": [
    { "title": "Slide Title", "points": ["point 1", "point 2"] }
  ]
}
Input: ${text}`
  ]);

  const response = await result.response;
  let jsonText = response.text();

  // 👇 Remove markdown code block wrappers
  jsonText = jsonText.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "");

  try {
    return JSON.parse(jsonText);
  } catch (err) {
    console.error("Gemini raw output:", jsonText);
    console.error("Gemini response parse error:", err);
    throw new Error("AI did not return valid JSON.");
  }
}

