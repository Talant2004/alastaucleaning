"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

export function ObjectionsSection() {
  const t = useTranslations("objections");
  const items = t.raw("items") as { tag: string; fear: string; answer: string }[];

  return (
    <section className="shell py-24 md:py-32">
      <Reveal>
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 className="h2 mt-5 max-w-[24ch]">{t("h2")}</h2>
        <p className="muted mt-5 max-w-[56ch]">{t("sub")}</p>
      </Reveal>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal
            as="li"
            key={item.fear}
            index={index}
            className="surface group relative flex flex-col p-6 transition-transform duration-500 ease-[var(--ease-brand)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]"
          >
            <span className="eyebrow text-[0.6rem] text-[var(--color-brass)]">{item.tag}</span>

            <svg
              viewBox="0 0 40 40"
              aria-hidden
              className="mt-6 size-9 stroke-[var(--color-sage-600)]"
              fill="none"
              strokeWidth="1"
            >
              <circle cx="20" cy="20" r="18" className="opacity-40" />
              <path
                d="M12 21.5 17.5 27 28 14"
                className="origin-center transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-110"
              />
            </svg>

            <h3 className="h3 mt-6 text-xl">{item.fear}</h3>
            <p className="muted mt-3 text-sm leading-relaxed">{item.answer}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
