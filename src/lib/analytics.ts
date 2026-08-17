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

/**
 * Единая точка отправки целей. Пока счётчики не подключены — пишем в dataLayer,
 * чтобы события не терялись и подхватились после установки GA4 / Метрики.
 */
export function track(event: EventName, params: Params = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
  window.gtag?.("event", event, params);
}

/** Лёгкая тактильная отдача на тумблерах и шагах калькулятора. */
export function haptic(ms = 8) {
  if (typeof navigator === "undefined") return;
  navigator.vibrate?.(ms);
}
