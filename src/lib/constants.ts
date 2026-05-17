export const PLANS = {
  FREE_LIFETIME_GENS: 3,
  AD_GENS_PER_VIEW: 3,
  PRO_PRICE: 99,
  CREDIT_PACK_SMALL: 49,
  CREDIT_PACK_LARGE: 149,
  CREDIT_PACK_SMALL_GENS: 200,
  CREDIT_PACK_LARGE_GENS: 500,
} as const;

export const PLATFORMS = [
  { id: "youtube", label: "YouTube Shorts", emoji: "▶️" },
  { id: "instagram", label: "Instagram Reels", emoji: "📸" },
  { id: "facebook", label: "Facebook Reels", emoji: "👥" },
  { id: "whatsapp", label: "WhatsApp Channel", emoji: "💬" },
] as const;

export const GEMINI_MODEL = "gemini-2.0-flash-lite";