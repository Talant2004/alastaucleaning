"use client";

import { CONTACT, waLink, type WaSource } from "@/lib/contact";
import { track } from "@/lib/analytics";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Props = {
  source: WaSource;
  text: string;
  label?: string;
  showNumber?: boolean;
  className?: string;
  variant?: "primary" | "ghost" | "brass";
};

/**
 * Зелёный #25D366 сознательно не используем как заливку — он выламывает палитру.
 * Узнаваемость даёт силуэт глифа, а не цвет.
 */
export function WhatsAppButton({
  source,
  text,
  label = "Написать в WhatsApp",
  showNumber = false,
  className = "",
  variant = "ghost",
}: Props) {
  return (
    <a
      {...waLink(source, text)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { source })}
      aria-label={`${label}: ${CONTACT.phoneDisplay}`}
      className={`btn btn-${variant} ${className}`}
    >
      <WhatsAppIcon />
      <span>{label}</span>
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
