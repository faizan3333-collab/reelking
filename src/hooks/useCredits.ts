"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import { PLANS } from "@/lib/constants";

export function useCredits(uid: string | null) {
  const [credits, setCredits] = useState(0);
  const [lifetimeUsed, setLifetimeUsed] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [proExpiresAt, setProExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }

    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setCredits(data.credits ?? 0);
        setLifetimeUsed(data.lifetimeUsed ?? 0);
        setIsPro(data.isPro ?? false);
        setProExpiresAt(data.proExpiresAt?.toDate() ?? null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const canGenerate = isPro || credits > 0 || lifetimeUsed < PLANS.FREE_LIFETIME_GENS;

  const creditsLeft = isPro
    ? "Unlimited"
    : credits > 0
    ? `${credits} credits`
    : `${PLANS.FREE_LIFETIME_GENS - lifetimeUsed} free gens left`;

  return { credits, lifetimeUsed, isPro, proExpiresAt, loading, canGenerate, creditsLeft };
}