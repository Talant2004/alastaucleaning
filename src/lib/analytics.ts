type EventName =
  | "whatsapp_click"
  | "phone_click"
  | "calc_start"
  | "calc_extras_add"
  | "alastau_toggle"
  | "booking_submit";

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (id: number, action: string, ...rest: unknown[]) => void;
  }
}

const YM_ID = process.env.NEXT_PUBLIC_YM_ID
  ? Number(process.env.NEXT_PUBLIC_YM_ID)
  : NaN;

/**
 * Единая точка отправки целей в GA4 и Яндекс.Метрику.
 * Всегда пишем в dataLayer — даже без счётчиков события не теряются в отладке.
 */
export function track(event: EventName, params: Params = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });

  window.gtag?.("event", event, params);

  if (Number.isFinite(YM_ID) && YM_ID > 0) {
    window.ym?.(YM_ID, "reachGoal", event, params);
  }
}

/** Лёгкая тактильная отдача на тумблерах и шагах калькулятора. */
export function haptic(ms = 8) {
  if (typeof navigator === "undefined") return;
  navigator.vibrate?.(ms);
}
