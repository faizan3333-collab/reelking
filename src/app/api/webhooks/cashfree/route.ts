import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initAdminApp } from "@/lib/firebase/admin";

initAdminApp();

const CREDIT_PACK_MAP: Record<string, number> = {
  small: 200,
  large: 500,
};

function verifyWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string
): boolean {
  const secret = process.env.CASHFREE_SECRET_KEY!;
  const message = timestamp + rawBody;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64");
  return expected === signature;
}

function extractPlanFromNote(note: string): {
  uid: string;
  plan: string;
} | null {
  const uidMatch = note.match(/uid:([^\s-]+)/);
  const planMatch = note.match(/plan:([^\s-]+)/);
  if (!uidMatch || !planMatch) return null;
  return { uid: uidMatch[1], plan: planMatch[1] };
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const timestamp = req.headers.get("x-webhook-timestamp") || "";
    const signature = req.headers.get("x-webhook-signature") || "";

    if (!verifyWebhookSignature(rawBody, timestamp, signature)) {
      console.error("Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload?.type;
    const orderStatus = payload?.data?.order?.order_status;
    const orderNote = payload?.data?.order?.order_note || "";
    const orderId = payload?.data?.order?.order_id || "";

    console.log(`Cashfree webhook: ${eventType} | order: ${orderId} | status: ${orderStatus}`);

    if (eventType !== "PAYMENT_SUCCESS_WEBHOOK" && orderStatus !== "PAID") {
      return NextResponse.json({ received: true });
    }

    const extracted = extractPlanFromNote(orderNote);
    if (!extracted) {
      console.error("Could not extract uid/plan from order note:", orderNote);
      return NextResponse.json({ error: "Bad order note" }, { status: 400 });
    }

    const { uid, plan } = extracted;
    const db = getFirestore();
    const userRef = db.collection("users").doc(uid);

    // Idempotency: check if already processed
    const processedRef = db.collection("processed_webhooks").doc(orderId);
    const already = await processedRef.get();
    if (already.exists) {
      console.log("Duplicate webhook, skipping:", orderId);
      return NextResponse.json({ received: true });
    }

    // Mark as processed first
    await processedRef.set({ processedAt: FieldValue.serverTimestamp() });

    if (plan === "pro") {
      const now = new Date();
      const proExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      await userRef.update({
        isPro: true,
        proExpiresAt,
      });
      console.log(`Pro activated for uid: ${uid}`);
    } else if (CREDIT_PACK_MAP[plan]) {
      const creditsToAdd = CREDIT_PACK_MAP[plan];
      await userRef.update({
        credits: FieldValue.increment(creditsToAdd),
      });
      console.log(`Added ${creditsToAdd} credits for uid: ${uid}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}