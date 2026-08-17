import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { sanitizeBooking } from "@/lib/bookings";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";
import { formatBookingTelegram, notifyOwnerTelegram } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { ok: false, reason: "firebase_not_configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_json" }, { status: 400 });
  }

  const booking = sanitizeBooking(body);
  if (!booking) {
    return NextResponse.json({ ok: false, reason: "invalid_payload" }, { status: 400 });
  }

  try {
    const db = getFirestoreDb();
    const ref = await addDoc(collection(db, "bookings"), {
      ...booking,
      status: "new",
      source: "site",
      createdAt: serverTimestamp(),
    });

    // Не блокируем ответ клиенту — уведомление в фоне
    void notifyOwnerTelegram(
      formatBookingTelegram({
        id: ref.id,
        date: booking.date,
        time: booking.time,
        name: booking.name,
        phone: booking.phone,
        address: booking.address,
        message: booking.message,
        total: booking.estimate.total,
      }),
    );

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (error) {
    console.error("[booking]", error);
    return NextResponse.json({ ok: false, reason: "firestore_error" }, { status: 502 });
  }
}
