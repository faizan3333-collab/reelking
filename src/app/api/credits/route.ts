import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

const MAX_ADS_PER_DAY = 10;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { type, packSize } = await req.json();

    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (type === "ad") {
      // Daily ad limit check
      const today = new Date().toISOString().split("T")[0];
      const adsToday = userData.adsToday ?? 0;
      const adDate = userData.adDate ?? "";

      if (adDate === today && adsToday >= MAX_ADS_PER_DAY) {
        return NextResponse.json({ error: "Aaj ke ads khatam — kal aana" }, { status: 403 });
      }

      await userRef.update({
        credits: (userData.credits ?? 0) + 3,
        adsToday: adDate === today ? adsToday + 1 : 1,
        adDate: today,
      });

      return NextResponse.json({ success: true, creditsAdded: 3 });
    }

    if (type === "pack") {
      // Pack credits — called from Cashfree webhook, not directly
      const creditsMap = { small: 200, large: 500 };
      const add = creditsMap[packSize as "small" | "large"] ?? 0;
      if (!add) return NextResponse.json({ error: "Invalid pack" }, { status: 400 });

      await userRef.update({
        credits: (userData.credits ?? 0) + add,
      });

      return NextResponse.json({ success: true, creditsAdded: add });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  } catch (error) {
    console.error("Credits error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}