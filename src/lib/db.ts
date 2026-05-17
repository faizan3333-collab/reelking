import { adminDb } from "@/lib/firebase/admin";
import { PLANS } from "@/lib/constants";

export async function createUser(uid: string, email: string) {
  const userRef = adminDb.collection("users").doc(uid);
  const existing = await userRef.get();
  
  if (!existing.exists) {
    await userRef.set({
      uid,
      email,
      isPro: false,
      credits: 0,
      lifetimeUsed: 0,
      createdAt: new Date(),
    });
  }
}

export async function getUser(uid: string) {
  const userRef = adminDb.collection("users").doc(uid);
  const snap = await userRef.get();
  return snap.exists ? snap.data() : null;
}

export async function addCredits(uid: string, amount: number) {
  const userRef = adminDb.collection("users").doc(uid);
  const snap = await userRef.get();
  const current = snap.data()?.credits ?? 0;
  await userRef.update({ credits: current + amount });
}

export async function setPro(uid: string, months: number = 1) {
  const userRef = adminDb.collection("users").doc(uid);
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + months);
  await userRef.update({
    isPro: true,
    proExpiresAt: expiresAt,
  });
}

export async function getUserGenerations(uid: string) {
  const snap = await adminDb
    .collection("generations")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(20)
    .get();
  
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}