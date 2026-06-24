require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Sends a prompt to Gemini and returns raw text
async function askAI(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}

// Sends a prompt and parses response as JSON
async function askAIForJSON(prompt) {
  const rawText = await askAI(prompt);

  // Remove markdown code block wrappers if present
  let cleanText = rawText.trim();
  cleanText = cleanText.replace(/^```json\s*/i, "");
  cleanText = cleanText.replace(/^```\s*/i, "");
  cleanText = cleanText.replace(/```\s*$/i, "");

  try {
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("Failed to parse AI response as JSON:", cleanText);
    throw new Error("AI returned invalid JSON format");
  }
}

module.exports = { askAI, askAIForJSON };