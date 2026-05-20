// Cashfree utility — client-side payment initialization
// Server-side logic is in /api/cashfree/create-order and /api/webhooks/cashfree

export type PlanType = "small" | "large" | "pro";

export const PLAN_DETAILS: Record<PlanType, { label: string; amount: number; description: string }> = {
  small: { label: "200 Credits", amount: 49, description: "200 generations, never expire" },
  large: { label: "500 Credits", amount: 149, description: "500 generations, best value" },
  pro: { label: "Pro Monthly", amount: 99, description: "Unlimited gens + history + no ads" },
};

export async function initiateCashfreePayment(
  token: string,
  plan: PlanType
): Promise<{ success: boolean; payment_link?: string; error?: string }> {
  try {
    const res = await fetch("/api/cashfree/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Payment failed" };
    }

    return { success: true, payment_link: data.payment_link };
  } catch {
    return { success: false, error: "Network error" };
  }
}