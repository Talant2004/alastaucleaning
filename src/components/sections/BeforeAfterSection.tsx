"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { LensCompare } from "@/components/ui/LensCompare";

type CaseItem = {
  id: string;
  filter: string;
  title: string;
  district: string;
  area: number;
  hours: number;
  crew: number;
  price: string;
  beforeBrief: string;
  afterBrief: string;
};

export function BeforeAfterSection() {
  const t = useTranslations("beforeAfter");
  const cases = t.raw("cases") as CaseItem[];
  const filterLabels = t.raw("filters") as Record<string, string>;
  const filterKeys = ["all", ...Object.keys(filterLabels)];
  const [filter, setFilter] = useState("all");

  const visible =
    filter === "all" ? cases : cases.filter((item) => item.filter === filter);

  return (
    <section id="cases" className="shell py-24 md:py-32">
      <Reveal>
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 className="h2 mt-5 max-w-[22ch]">{t("h2")}</h2>
        <p className="muted mt-5 max-w-[54ch]">{t("sub")}</p>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-2">
        {filterKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`hairline rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
              filter === key
                ? "border-transparent bg-[var(--color-obsidian)] text-[var(--color-linen)]"
                : ""
            }`}
          >
            {key === "all" ? t("all") : filterLabels[key]}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-6 lg:grid-cols-2">
        {visible.map((item, index) => (
          <Reveal as="li" key={item.id} index={index}>
            <LensCompare beforeBrief={item.beforeBrief} afterBrief={item.afterBrief} />

            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="h3 text-xl">{item.title}</h3>
                <p className="muted mt-1 text-sm">{item.district}</p>
              </div>
              <p className="nums text-lg text-[var(--color-sage-600)]">{item.price}</p>
            </div>

            <dl className="eyebrow mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[0.6rem]">
              {item.area > 0 && (
                <div className="flex gap-1.5">
                  <dt>{t("area")}</dt>
                  <dd className="nums text-[var(--fg)]">{item.area} м²</dd>
                </div>
              )}
              <div className="flex gap-1.5">
                <dt>{t("time")}</dt>
                <dd className="nums text-[var(--fg)]">{item.hours} ч</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>{t("crew")}</dt>
                <dd className="nums text-[var(--fg)]">{item.crew}</dd>
              </div>
            </dl>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
