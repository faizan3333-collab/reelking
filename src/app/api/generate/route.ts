import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { generateContent } from "@/lib/gemini";
import { buildPrompt } from "@/features/generation/prompts";
import { PLANS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Credit check
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const credits = userData.credits ?? 0;
    const lifetimeUsed = userData.lifetimeUsed ?? 0;
    const isPro = userData.isPro ?? false;

    // Free tier check
    if (!isPro && credits <= 0 && lifetimeUsed >= PLANS.FREE_LIFETIME_GENS) {
      return NextResponse.json({ error: "NO_CREDITS" }, { status: 403 });
    }

    // Parse request
    const { idea, platforms } = await req.json();
    if (!idea || !platforms?.length) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Generate
    const prompt = buildPrompt(idea, platforms);
    const raw = await generateContent(prompt);

    // Parse JSON
    const clean = raw.replace(/```json|```/g, "").trim();
    const output = JSON.parse(clean);

    // Deduct credit
    if (!isPro) {
      if (credits > 0) {
        await userRef.update({ credits: credits - 1 });
      } else {
        await userRef.update({ lifetimeUsed: lifetimeUsed + 1 });
      }
    }

    // Save to history
    await adminDb.collection("generations").add({
      uid,
      idea,
      platforms,
      output,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, output });

  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}