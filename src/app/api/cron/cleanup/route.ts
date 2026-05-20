import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "@/lib/firebase/admin";

initAdminApp();

// Runs daily at 3 AM — cleans old processed webhooks (older than 7 days)
export async function GET(req: NextRequest) {
  const cronSecret = req.headers.get("authorization");
  if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getFirestore();
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    // Clean processed webhooks
    const oldWebhooks = await db
      .collection("processed_webhooks")
      .where("processedAt", "<", cutoff)
      .limit(500)
      .get();

    if (!oldWebhooks.empty) {
      const batch = db.batch();
      oldWebhooks.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      console.log(`Cleanup: deleted ${oldWebhooks.size} old webhook records`);
    }

    // Optional: clean generations older than 90 days for free users
    // (keeps history for Pro users only)
    const oldFreeGenerations = await db
      .collection("generations")
      .where("createdAt", "<", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
      .limit(200)
      .get();

    let genDeleted = 0;
    if (!oldFreeGenerations.empty) {
      // Only delete if user is not Pro
      const batch = db.batch();
      for (const doc of oldFreeGenerations.docs) {
        const uid = doc.data().uid;
        const userDoc = await db.collection("users").doc(uid).get();
        if (!userDoc.exists || !userDoc.data()?.isPro) {
          batch.delete(doc.ref);
          genDeleted++;
        }
      }
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      webhooksDeleted: oldWebhooks.size,
      generationsDeleted: genDeleted,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Cleanup cron error:", err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}