export const CONTACT = {
  phoneDisplay: "8 707 306 75 76",
  phoneTel: "+77073067576",
  whatsapp: "77073067576",
  hoursFrom: 8,
  hoursTo: 21,
  replyMinutes: 7,
  city: "Алматы",
} as const;

export type WaSource =
  | "header"
  | "hero"
  | "fab"
  | "mobile_bar"
  | "estimate"
  | "calc_fallback"
  | "alastau"
  | "faq"
  | "footer"
  | "final_cta";

/**
 * Единственный способ собрать ссылку на WhatsApp.
 * Прямые wa.me в JSX запрещены — иначе теряем разбивку по источникам в аналитике.
 */
export function waLink(source: WaSource, text: string) {
  const url = new URL(`https://wa.me/${CONTACT.whatsapp}`);
  url.searchParams.set("text", text);
  return { href: url.toString(), "data-wa-source": source };
}

export const WA_TEXTS = {
  header: "Здравствуйте! Хочу уточнить стоимость уборки.",
  hero: "Здравствуйте! Хочу уточнить стоимость уборки квартиры.",
  fab: "Здравствуйте! Подскажите цену уборки, считать самому неудобно.",
  mobileBar: "Здравствуйте! Подскажите стоимость уборки.",
  calcFallback: "Здравствуйте! Помогите посчитать уборку — не хочу разбираться в калькуляторе.",
  alastau: "Здравствуйте! Интересует уборка с обрядом Аластау. Расскажите подробнее.",
  faq: "Здравствуйте! У меня вопрос по уборке: ",
  footer: "Здравствуйте! Хочу записаться на уборку.",
  finalCta: "Здравствуйте! Хочу записаться на уборку с обрядом Аластау.",
} as const;

/** Алматы — UTC+5. Считаем по времени города, а не браузера клиента. */
export function isWorkingHours(date = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("ru-KZ", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Almaty",
    }).format(date),
  );
  return hour >= CONTACT.hoursFrom && hour < CONTACT.hoursTo;
}
