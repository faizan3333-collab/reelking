import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initAdminApp } from "@/lib/firebase/admin";
import { generateContent } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";

initAdminApp();

const FREE_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    // Auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;

    // Rate limit
    const { allowed, response: rlResponse } = await checkRateLimit(req, uid);
    if (!allowed) return rlResponse!;

    const body = await req.json();
    const { idea, platforms } = body;

    if (!idea || !platforms?.length) {
      return NextResponse.json({ error: "idea aur platforms dono chahiye" }, { status: 400 });
    }

    const db = getFirestore();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userDoc.data()!;
    const isPro = user.isPro === true;
    const credits = user.credits || 0;
    const lifetimeUsed = user.lifetimeUsed || 0;

    // Pro expiry check
    if (isPro && user.proExpiresAt) {
      const expiry = user.proExpiresAt.toDate?.() || new Date(user.proExpiresAt);
      if (expiry < new Date()) {
        await userRef.update({ isPro: false });
        return NextResponse.json(
          { error: "Pro subscription expire ho gayi. Renew karo!" },
          { status: 402 }
        );
      }
    }

    // Credit check
    if (!isPro) {
      if (credits > 0) {
        await userRef.update({ credits: FieldValue.increment(-1) });
      } else if (lifetimeUsed < FREE_LIMIT) {
        await userRef.update({ lifetimeUsed: FieldValue.increment(1) });
      } else {
        return NextResponse.json(
          { error: "Credits khatam! Ad dekho ya pack kharido." },
          { status: 402 }
        );
      }
    }

    // Generate
    const output = await generateContent({ idea, platforms });

    // Save to history
    await db.collection("generations").add({
      uid,
      idea,
      platforms,
      output,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, output });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}