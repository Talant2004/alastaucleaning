"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { MediaSlot } from "@/components/ui/MediaSlot";

type Person = { name: string; role: string; years: number; jobs: number; rating: string };
type CheckItem = { zone: string; points: number; sample: string };
type ChemItem = { title: string; note: string };

export function TeamSection() {
  const t = useTranslations("team");
  const people = t.raw("people") as Person[];
  const badges = t.raw("badges") as string[];
  const checklist = t.raw("checklist") as CheckItem[];
  const chemistry = t.raw("chemistry") as ChemItem[];

  return (
    <section id="team" className="shell py-24 md:py-32">
      <Reveal>
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 className="h2 mt-5 max-w-[22ch]">{t("h2")}</h2>
        <p className="muted mt-5 max-w-[54ch]">{t("sub")}</p>
      </Reveal>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((person, index) => (
          <Reveal as="li" key={person.name} index={index} className="surface overflow-hidden p-4">
            <MediaSlot
              brief={`ПОРТРЕТ: ${person.name}`}
              ratio="3 / 4"
            />
            <h3 className="h3 mt-5 text-lg">{person.name}</h3>
            <p className="muted mt-1 text-xs">{person.role}</p>

            <dl className="nums mt-4 flex gap-4 text-xs">
              <div>
                <dt className="eyebrow text-[0.55rem]">{t("years")}</dt>
                <dd>{t("yearsUnit", { n: person.years })}</dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.55rem]">{t("jobs")}</dt>
                <dd>{person.jobs}</dd>
              </div>
              <div>
                <dt className="eyebrow text-[0.55rem]">{t("rating")}</dt>
                <dd>{person.rating} ★</dd>
              </div>
            </dl>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {badges.map((badge) => (
                <li
                  key={badge}
                  className="eyebrow rounded-full border border-[color-mix(in_oklab,var(--color-brass)_50%,transparent)] px-2.5 py-1 text-[0.5rem]"
                >
                  {badge}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>

      <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal>
          <h3 className="h2 text-3xl">{t("checklistTitle")}</h3>
          <p className="muted mt-4 max-w-[48ch] text-sm">{t("checklistSub")}</p>

          <ul className="mt-8">
            {checklist.map((item) => (
              <li
                key={item.zone}
                className="flex items-baseline justify-between gap-6 border-b border-[var(--hairline)] py-4"
              >
                <div>
                  <p className="text-sm font-medium">{item.zone}</p>
                  <p className="muted mt-1 text-xs">{item.sample}</p>
                </div>
                <span className="nums shrink-0 text-sm text-[var(--color-sage-600)]">
                  {item.points}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal index={1}>
          <h3 className="h2 text-3xl">{t("chemistryTitle")}</h3>
          <p className="muted mt-4 max-w-[48ch] text-sm">{t("chemistrySub")}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {chemistry.map((item) => (
              <li key={item.title} className="surface p-4">
                <p className="nums text-sm">{item.title}</p>
                <p className="muted mt-1.5 text-xs">{item.note}</p>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-6 text-[0.6rem] leading-relaxed">{t("chemistryNote")}</p>
        </Reveal>
      </div>
    </section>
  );
}
