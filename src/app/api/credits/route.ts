import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initAdminApp } from "@/lib/firebase/admin";

initAdminApp();

const MAX_ADS_PER_DAY = 10;
const CREDITS_PER_AD = 3;
const PACK_CREDITS: Record<string, number> = {
  small: 200,
  large: 500,
};

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;

    const body = await req.json();
    const { type, packSize } = body;

    const db = getFirestore();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userDoc.data()!;
    const today = new Date().toISOString().split("T")[0];

    if (type === "ad") {
      const adsToday = user.adDate === today ? (user.adsToday || 0) : 0;

      if (adsToday >= MAX_ADS_PER_DAY) {
        return NextResponse.json(
          { error: `Aaj ke ${MAX_ADS_PER_DAY} ads ho gaye. Kal aao!` },
          { status: 429 }
        );
      }

      await userRef.update({
        credits: FieldValue.increment(CREDITS_PER_AD),
        adsToday: adsToday + 1,
        adDate: today,
      });

      return NextResponse.json({
        success: true,
        creditsAdded: CREDITS_PER_AD,
        message: `+${CREDITS_PER_AD} credits mile! (${adsToday + 1}/${MAX_ADS_PER_DAY} aaj)`,
      });
    }

    if (type === "pack") {
      if (!packSize || !PACK_CREDITS[packSize]) {
        return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
      }
      // Pack credits are added via webhook after payment
      // This endpoint is for confirming pack (future use)
      return NextResponse.json({ success: true, message: "Payment initiate karo" });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("Credits error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}