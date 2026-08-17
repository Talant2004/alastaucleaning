import { NextResponse } from "next/server";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ reviews: [], source: "fallback" as const });
  }

  try {
    const snap = await getDocs(
      query(collection(getFirestoreDb(), "reviews"), where("published", "==", true), limit(12)),
    );

    const reviews = snap.docs.map((item) => {
      const data = item.data();
      return {
        id: item.id,
        name: String(data.name ?? ""),
        context: String(data.context ?? ""),
        quote: String(data.quote ?? data.text ?? ""),
      };
    });

    return NextResponse.json({
      reviews,
      source: reviews.length ? ("firestore" as const) : ("fallback" as const),
    });
  } catch (error) {
    console.error("[reviews]", error);
    return NextResponse.json({ reviews: [], source: "fallback" as const });
  }
}
