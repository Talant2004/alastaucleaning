"use client";

import { useTranslations } from "next-intl";
import { CONTACT } from "@/lib/contact";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";

export function FaqSection() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.replace("{phone}", CONTACT.phoneDisplay),
      },
    })),
  };

  return (
    <section id="faq" className="shell py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="h2 mt-5">{t("h2")}</h2>
          <p className="muted mt-5 max-w-[40ch] text-sm">{t("sub")}</p>
          <WhatsAppButton
            source="faq"
            textKey="faq"
            label={t("ask")}
            variant="brass"
            className="mt-7"
          />
        </Reveal>

        <div>
          {items.map((item, index) => (
            <Reveal as="div" key={item.q} index={index}>
              <details className="group border-b border-[var(--hairline)] py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <span className="h3 text-lg">{item.q}</span>
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-[var(--hairline)] transition-transform duration-500 ease-[var(--ease-brand)] group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="muted mt-4 max-w-[62ch] text-sm leading-relaxed">
                  {item.a.replace("{phone}", CONTACT.phoneDisplay)}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
