"use client";

// AdSense Rewarded Ad integration
// Phase 1: Simulated (3s delay) → real AdSense when account approved
// Phase 2: AdMob via TWA (Play Store)

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    googletag?: {
      cmd: unknown[];
      pubads: () => {
        addEventListener: (event: string, cb: (e: { inView: boolean }) => void) => void;
      };
      display: (slot: unknown) => void;
      enableServices: () => void;
    };
  }
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const REWARDED_AD_SLOT = process.env.NEXT_PUBLIC_REWARDED_AD_SLOT || "";
const USE_REAL_ADS = !!ADSENSE_CLIENT && !!REWARDED_AD_SLOT;

export interface AdResult {
  success: boolean;
  error?: string;
}

// Simulate ad — replace with real when AdSense approved
function simulateAd(): Promise<AdResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 3000); // 3s simulate
  });
}

// Real AdSense Rewarded Ad
function showRealRewardedAd(): Promise<AdResult> {
  return new Promise((resolve) => {
    try {
      if (typeof window === "undefined" || !window.adsbygoogle) {
        resolve({ success: false, error: "AdSense not loaded" });
        return;
      }

      window.adsbygoogle = window.adsbygoogle || [];
      (window.adsbygoogle as Array<{
        params: { google_ad_client: string; google_ad_slot: string };
        type: string;
        callback: (result: { status: string }) => void;
      }>).push({
        params: {
          google_ad_client: ADSENSE_CLIENT,
          google_ad_slot: REWARDED_AD_SLOT,
        },
        type: "rewarded",
        callback: (result: { status: string }) => {
          if (result.status === "granted") {
            resolve({ success: true });
          } else {
            resolve({ success: false, error: "Ad not completed" });
          }
        },
      });
    } catch (err) {
      console.error("Ad error:", err);
      resolve({ success: false, error: "Ad failed" });
    }
  });
}

export async function showRewardedAd(): Promise<AdResult> {
  if (USE_REAL_ADS) {
    return showRealRewardedAd();
  }
  return simulateAd();
}

export function isAdSupported(): boolean {
  if (typeof window === "undefined") return false;
  // Block ad if user has ad blocker (basic check)
  return true;
}

export const AD_CONFIG = {
  creditsPerAd: 3,
  maxAdsPerDay: 10,
  useRealAds: USE_REAL_ADS,
};