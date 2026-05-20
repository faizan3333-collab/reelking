// Rate limiting using Upstash Redis
// Free tier: 10K commands/day, 256MB storage
// Install: npm install @upstash/redis @upstash/ratelimit
// Env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN

import { NextRequest, NextResponse } from "next/server";

// Lazy import to avoid crash if Upstash not configured
async function getRateLimiter() {
  try {
    const { Redis } = await import("@upstash/redis");
    const { Ratelimit } = await import("@upstash/ratelimit");

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 m"), // 20 req/min per user
      analytics: false,
    });
  } catch {
    return null;
  }
}

export async function checkRateLimit(
  req: NextRequest,
  identifier: string
): Promise<{ allowed: boolean; response?: NextResponse }> {
  // If Upstash not configured, allow all
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return { allowed: true };
  }

  try {
    const limiter = await getRateLimiter();
    if (!limiter) return { allowed: true };

    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    if (!success) {
      return {
        allowed: false,
        response: NextResponse.json(
          {
            error: "Too many requests. Thoda ruko bhai! 1 minute baad try karo.",
            limit,
            remaining,
            reset,
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": String(limit),
              "X-RateLimit-Remaining": String(remaining),
              "X-RateLimit-Reset": String(reset),
            },
          }
        ),
      };
    }

    return { allowed: true };
  } catch (err) {
    console.error("Rate limit check failed:", err);
    return { allowed: true }; // Fail open
  }
}