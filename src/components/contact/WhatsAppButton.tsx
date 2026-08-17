"use client";

import { useTranslations } from "next-intl";
import { CONTACT, waLink, type WaSource } from "@/lib/contact";
import { track } from "@/lib/analytics";
import { WhatsAppIcon } from "./WhatsAppIcon";

type WaTextKey =
  | "header"
  | "hero"
  | "fab"
  | "mobileBar"
  | "calcFallback"
  | "alastau"
  | "faq"
  | "footer"
  | "finalCta";

type Props = {
  source: WaSource;
  /** Ключ из contact.waTexts — локализованный текст. Либо готовый text. */
  textKey?: WaTextKey;
  text?: string;
  label?: string;
  showNumber?: boolean;
  className?: string;
  variant?: "primary" | "ghost" | "brass";
};

export function WhatsAppButton({
  source,
  textKey,
  text,
  label,
  showNumber = false,
  className = "",
  variant = "ghost",
}: Props) {
  const t = useTranslations("contact");
  const resolvedLabel = label ?? t("waWrite");
  const resolvedText = text ?? (textKey ? t(`waTexts.${textKey}`) : t("waTexts.header"));

  return (
    <a
      {...waLink(source, resolvedText)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { source })}
      aria-label={`${resolvedLabel}: ${CONTACT.phoneDisplay}`}
      className={`btn btn-${variant} ${className}`}
    >
      <WhatsAppIcon />
      <span>{resolvedLabel}</span>
      {showNumber && <span className="nums hidden lg:inline">{CONTACT.phoneDisplay}</span>}
    </a>
  );
}

export function PhoneLink({
  source = "footer",
  className = "",
}: {
  source?: string;
  className?: string;
}) {
  return (
    <a
      href={`tel:${CONTACT.phoneTel}`}
      onClick={() => track("phone_click", { source })}
      className={`nums transition-colors hover:text-[var(--color-ember-500)] ${className}`}
    >
      {CONTACT.phoneDisplay}
    </a>
  );
}
