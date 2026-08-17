export const FALLBACK_TIME_SLOTS: string[] = ["09:00", "11:00", "13:00", "15:00", "17:00"];

export const FALLBACK_SLOT_CAPACITY: { free: number; total: number } = {
  free: 3,
  total: 14,
};

export type DayOption = {
  iso: string;
  label: string;
  weekday: string;
  /** Если задано — времена только для этого дня */
  times?: string[];
};

export type SlotsPayload = {
  free: number;
  total: number;
  times: string[];
  days: DayOption[];
  source: "firestore" | "fallback";
};

export function nextDays(count: number, locale = "ru-KZ"): DayOption[] {
  const formatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      iso: date.toISOString().slice(0, 10),
      label: formatter.format(date),
      weekday: weekday.format(date),
    };
  });
}

export function fallbackSlots(locale = "ru-KZ"): SlotsPayload {
  return {
    free: FALLBACK_SLOT_CAPACITY.free,
    total: FALLBACK_SLOT_CAPACITY.total,
    times: [...FALLBACK_TIME_SLOTS],
    days: nextDays(7, locale),
    source: "fallback",
  };
}
