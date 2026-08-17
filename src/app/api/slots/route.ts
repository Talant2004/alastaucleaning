import { NextResponse } from "next/server";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase";
import {
  FALLBACK_TIME_SLOTS,
  fallbackSlots,
  nextDays,
  type DayOption,
  type SlotsPayload,
} from "@/lib/slots";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "kz" ? "kk-KZ" : "ru-KZ";
  const base = fallbackSlots(locale);

  if (!isFirebaseConfigured()) {
    return NextResponse.json(base);
  }

  try {
    const db = getFirestoreDb();
    const settingsSnap = await getDoc(doc(db, "settings", "slots"));

    let free = base.free;
    let total = base.total;
    let times = [...FALLBACK_TIME_SLOTS];
    let dayCount = 7;
    let fromSettings = false;

    if (settingsSnap.exists()) {
      fromSettings = true;
      const data = settingsSnap.data() as {
        free?: number;
        total?: number;
        times?: string[];
        dayCount?: number;
      };
      if (Number.isFinite(Number(data.free))) free = Math.max(0, Math.round(Number(data.free)));
      if (Number.isFinite(Number(data.total)))
        total = Math.max(free, Math.round(Number(data.total)));
      if (Array.isArray(data.times) && data.times.every((t) => typeof t === "string")) {
        times = data.times.map(String);
      }
      if (Number.isFinite(Number(data.dayCount))) {
        dayCount = Math.min(14, Math.max(3, Math.round(Number(data.dayCount))));
      }
    }

    const today = new Date().toISOString().slice(0, 10);
    let days: DayOption[] = nextDays(dayCount, locale);
    let dayTimes = times;
    let fromSlots = false;

    try {
      const slotsSnap = await getDocs(
        query(collection(db, "slots"), where("date", ">=", today), orderBy("date"), limit(21)),
      );

      const available = slotsSnap.docs.filter((item) => {
        const data = item.data() as { available?: boolean };
        return data.available !== false;
      });

      if (available.length) {
        fromSlots = true;
        const formatter = new Intl.DateTimeFormat(locale, {
          day: "numeric",
          month: "short",
        });
        const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });

        days = available.map((item) => {
          const data = item.data() as { date: string; times?: string[] };
          const date = new Date(`${data.date}T12:00:00`);
          return {
            iso: data.date,
            label: formatter.format(date),
            weekday: weekday.format(date),
            times: Array.isArray(data.times) && data.times.length ? data.times.map(String) : times,
          };
        });

        dayTimes = days[0]?.times?.length ? days[0].times : times;
        free = available.length;
        if (!fromSettings) total = Math.max(free, base.total);
      }
    } catch (slotsError) {
      console.warn("[slots] collection query skipped:", slotsError);
    }

    const payload: SlotsPayload = {
      free,
      total,
      times: dayTimes,
      days,
      source: fromSlots || fromSettings ? "firestore" : "fallback",
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("[slots]", error);
    return NextResponse.json(base);
  }
}
