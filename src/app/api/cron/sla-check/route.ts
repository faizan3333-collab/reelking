import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initAdminApp } from "@/lib/firebase/admin";

initAdminApp();

// Runs daily at 6 AM — checks expired Pro subscriptions
export async function GET(req: NextRequest) {
  const cronSecret = req.headers.get("authorization");
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getFirestore();
    const now = new Date();

    const expiredQuery = await db
      .collection("users")
      .where("isPro", "==", true)
      .where("proExpiresAt", "<", now)
      .get();

    if (expiredQuery.empty) {
      return NextResponse.json({ success: true, expired: 0 });
    }

    const batch = db.batch();
    expiredQuery.docs.forEach((doc) => {
      batch.update(doc.ref, { isPro: false });
    });
    await batch.commit();

    console.log(`SLA check: ${expiredQuery.size} Pro subscriptions expired`);

    return NextResponse.json({
      success: true,
      expired: expiredQuery.size,
      timestamp: now.toISOString(),
    });
  } catch (err) {
    console.error("SLA check error:", err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}