"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** Синхронизирует <html lang> с активной локалью. */
export function LocaleHtml() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale === "kz" ? "kk" : "ru";
  }, [locale]);

  return null;
}
