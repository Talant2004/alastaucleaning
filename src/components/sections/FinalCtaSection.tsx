"use client";

import { useTranslations } from "next-intl";
import { CONTACT } from "@/lib/contact";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneLink, WhatsAppButton } from "@/components/contact/WhatsAppButton";

export function FinalCtaSection() {
  const t = useTranslations("finalCta");

  return (
    <section data-theme-zone="night" className="relative overflow-hidden py-28 md:py-36">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[var(--color-obsidian)]" />
      <div
        aria-hidden
        className="absolute bottom-[-30%] left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full opacity-40 blur-[140px]"
        style={{ background: "var(--color-ember-600)" }}
      />

      <div className="shell text-center">
        <Reveal>
          <p className="eyebrow text-[var(--color-brass)]">{t("eyebrow")}</p>
          <h2 className="h2 mx-auto mt-6 max-w-[22ch]">{t("h2")}</h2>
          <p className="muted mx-auto mt-6 max-w-[46ch]">
            {t("sub", {
              minutes: CONTACT.replyMinutes,
              from: CONTACT.hoursFrom,
              to: CONTACT.hoursTo,
            })}
          </p>

          <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#calc" className="btn btn-primary">
              {t("ctaCalc")}
            </a>
            <WhatsAppButton
              source="final_cta"
              textKey="finalCta"
              label={t("ctaWa")}
              variant="brass"
            />
          </div>

          <p className="mt-10">
            <span className="eyebrow block text-[0.6rem]">{t("orCall")}</span>
            <PhoneLink source="final_cta" className="mt-2 inline-block text-2xl" />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
