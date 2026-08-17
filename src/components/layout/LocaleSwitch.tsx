"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function LocaleSwitch() {
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: AppLocale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="eyebrow flex items-center gap-1.5 text-[0.6rem]" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => switchTo("kz")}
        aria-pressed={locale === "kz"}
        className={`transition-opacity ${locale === "kz" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
      >
        {t("localeKz")}
      </button>
      <span aria-hidden className="opacity-30">
        /
      </span>
      <button
        type="button"
        onClick={() => switchTo("ru")}
        aria-pressed={locale === "ru"}
        className={`transition-opacity ${locale === "ru" ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
      >
        {t("localeRu")}
      </button>
    </div>
  );
}
