import { CONTACT } from "@/lib/contact";

/**
 * Юридические реквизиты — единственный источник для футера и политики.
 * Перед публикацией заполните iin и email. Пустые поля в интерфейс не выводятся.
 */
export const COMPANY = {
  form: "ИП" as const,
  brand: "ALAS",
  /** Краткое наименование для футера и документов */
  legalName: "ИП «ALAS»",
  /** ИИН владельца ИП (12 цифр). Пока пусто — не выводим. */
  iin: "",
  /** Юридический / почтовый адрес */
  address: "Алматы, Республика Казахстан",
  /** E-mail для запросов по персональным данным. Пока пусто — используем WhatsApp. */
  email: "",
  city: CONTACT.city,
  country: "Казахстан",
} as const;

export function companyRequisitesLine() {
  const parts = [COMPANY.legalName];
  if (COMPANY.iin) parts.push(`ИИН ${COMPANY.iin}`);
  return parts.join(" · ");
}

/** Куда писать запрос на удаление данных */
export function privacyContact() {
  if (COMPANY.email) return { kind: "email" as const, value: COMPANY.email };
  return { kind: "whatsapp" as const, value: CONTACT.phoneDisplay };
}
