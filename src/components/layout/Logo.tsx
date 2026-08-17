"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  const t = useTranslations("common");

  return (
    <Link href="/" className={`group flex items-baseline gap-2 ${className}`} aria-label="ALAS">
      <span className="font-display text-2xl leading-none font-semibold tracking-[0.14em]">
        ALAS
      </span>
      <span
        aria-hidden
        className="mb-0.5 size-1.5 animate-(--animate-spark) rounded-full bg-[var(--color-ember-500)]"
      />
      <span className="eyebrow hidden text-[0.6rem] sm:block">{t("brandSuffix")}</span>
    </Link>
  );
}
