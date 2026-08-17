import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";
import { defaultPricing, parsePricingOverrides, resolvePricing } from "@/lib/pricing-overrides";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  const fallback = defaultPricing();

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ pricing: fallback, source: "fallback" as const });
  }

  try {
    const snap = await getDoc(doc(getFirestoreDb(), "settings", "pricing"));
    if (!snap.exists()) {
      return NextResponse.json({ pricing: fallback, source: "fallback" as const });
    }

    const overrides = parsePricingOverrides(snap.data());
    return NextResponse.json({
      pricing: resolvePricing(overrides),
      source: "firestore" as const,
    });
  } catch (error) {
    console.error("[pricing]", error);
    return NextResponse.json({ pricing: fallback, source: "fallback" as const });
  }
}
