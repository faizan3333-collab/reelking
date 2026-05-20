import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initAdminApp } from "@/lib/firebase/admin";

initAdminApp();

const PLANS = {
  small: { amount: 49, name: "ReelKing 200 Credits", credits: 200 },
  large: { amount: 149, name: "ReelKing 500 Credits", credits: 500 },
  pro: { amount: 99, name: "ReelKing Pro Monthly", credits: 0 },
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
    const email = decoded.email || "";

    const body = await req.json();
    const plan = body.plan as "small" | "large" | "pro";

    if (!PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planData = PLANS[plan];
    const orderId = `rk_${uid.slice(0, 8)}_${Date.now()}`;

    const cashfreePayload = {
      order_id: orderId,
      order_amount: planData.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: uid,
        customer_email: email,
        customer_phone: "9999999999", // required by Cashfree, update from user profile if available
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/credits?order_id={order_id}&status={order_status}`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cashfree`,
      },
      order_note: `${planData.name} - uid:${uid} - plan:${plan}`,
    };

    const cfRes = await fetch(
      `${process.env.CASHFREE_BASE_URL}/pg/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID!,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify(cashfreePayload),
      }
    );

    const cfData = await cfRes.json();

    if (!cfRes.ok) {
      console.error("Cashfree order creation failed:", cfData);
      return NextResponse.json(
        { error: "Payment initiation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment_session_id: cfData.payment_session_id,
      order_id: orderId,
      payment_link: cfData.payment_link,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}