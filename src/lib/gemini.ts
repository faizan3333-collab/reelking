import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function generateContent({
  idea,
  platforms,
}: {
  idea: string;
  platforms: string[];
}): Promise<Record<string, unknown>> {
  const platformList = platforms.join(", ");

  const prompt = `
You are an elite viral content manager from New Delhi.
Write in Hinglish (Hindi in Latin script).
Rules:

1. 70% Hindi spoken words, 30% English technical terms
2. Use daily slang: "Bhai", "Dhansu", "Ekdum Mast", "Systumm"
3. Output MUST be raw JSON only — no markdown, no backticks, no extra text
4. NEVER use **bold** or *italic* markdown — plain text only, no asterisks
5. Hooks must contain pattern-interrupt phrases
6. Title mein curiosity gap use karo: "5 signs...", "Ye galti mat karna...", "Sach jaante ho?"
7. Description personal story angle lo: "Mere saath bhi aisa hua tha..."
8. Pehli line mein hi hook karo — 3 seconds mein viewer rok lo
9. NEVER mention any product, brand, or website unless the user's idea explicitly contains that product name

Content Idea: ${idea}
Platforms needed: ${platformList}

Return ONLY this JSON structure (include only requested platforms):
{
  ${platforms.includes("youtube") ? `"youtube": { "title": "...", "description": "...", "hashtags": ["...", "..."] },` : ""}
  ${platforms.includes("instagram") ? `"instagram": { "caption": "...", "hashtags": ["...", "..."] },` : ""}
  ${platforms.includes("facebook") ? `"facebook": { "caption": "...", "hashtags": ["...", "..."] },` : ""}
  ${platforms.includes("whatsapp") ? `"whatsapp": { "message": "..." }` : ""}
}`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean JSON
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("Content generation failed");
  }
}