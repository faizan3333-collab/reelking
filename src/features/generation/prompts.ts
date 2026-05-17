import { PLATFORMS } from "@/lib/constants";

export function buildPrompt(idea: string, platforms: string[]): string {
  return `
Tu ek expert Indian social media content manager hai jo Hindi/Hinglish mein kaam karta hai.

Creator ka idea: "${idea}"

Inke liye viral content generate kar: ${platforms.join(", ")}

Rules:
1. 70% Hindi words, 30% English technical terms
2. KABHI shuddh Hindi mat use kar — daily slang use kar: "Bhai", "Dhansu", "Ekdum Mast", "Systumm"
3. Har platform ke liye alag style
4. Hooks mein pattern-interrupt phrases hone chahiye
5. Sirf JSON return kar — koi extra text nahi

Exact JSON format:
{
  "youtube": {
    "title": "catchy Hindi title (max 60 chars)",
    "description": "2-3 line Hinglish description",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  },
  "instagram": {
    "caption": "emotional Hinglish caption with hook (max 150 chars)",
    "hashtags": ["#tag1", "#tag2", "#tag3"]
  },
  "facebook": {
    "caption": "longer narrative caption for shares (max 300 chars)",
    "hashtags": ["#tag1", "#tag2"]
  },
  "whatsapp": {
    "message": "emoji-rich short copy with CTA (max 100 chars)"
  }
}

Sirf selected platforms ka output do: ${platforms.join(", ")}
`;
}