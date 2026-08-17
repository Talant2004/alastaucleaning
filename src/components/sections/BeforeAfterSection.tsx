"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { LensCompare } from "@/components/ui/LensCompare";

const CASES = [
  {
    id: "post-repair",
    filter: "После ремонта",
    title: "3-комнатная после ремонта",
    district: "ЖК «Алтын Ауыл», Бостандыкский район",
    area: 96,
    hours: 9,
    crew: 4,
    price: "76 800 ₸",
    beforeBrief: "ДО: строительная пыль на полу и подоконниках, следы затирки",
    afterBrief: "ПОСЛЕ: чистое стекло, пол без пыли, свет по всей комнате",
  },
  {
    id: "kitchen",
    filter: "Кухня",
    title: "Кухня с жиром на фасадах",
    district: "Медеуский район, частный дом",
    area: 18,
    hours: 4,
    crew: 2,
    price: "23 000 ₸",
    beforeBrief: "ДО: налёт на фасадах, жир на плите и вытяжке",
    afterBrief: "ПОСЛЕ: матовые фасады без разводов, чистая вытяжка",
  },
  {
    id: "sofa",
    filter: "Химчистка",
    title: "Диван после двух лет с питомцем",
    district: "Алмалинский район",
    area: 0,
    hours: 3,
    crew: 2,
    price: "13 000 ₸",
    beforeBrief: "ДО: пятна на подлокотниках, следы шерсти в швах",
    afterBrief: "ПОСЛЕ: восстановленный ворс, без запаха и разводов",
  },
];

const FILTERS = ["Все", ...new Set(CASES.map((item) => item.filter))];

export function BeforeAfterSection() {
  const [filter, setFilter] = useState("Все");
  const visible = filter === "Все" ? CASES : CASES.filter((item) => item.filter === filter);

  return (
    <section id="cases" className="shell py-24 md:py-32">
      <Reveal>
        <p className="eyebrow">Кейсы</p>
        <h2 className="h2 mt-5 max-w-[22ch]">Разница, которую видно без слов</h2>
        <p className="muted mt-5 max-w-[54ch]">
          Реальные объекты в Алматы. Тот же ракурс, тот же свет, без обработки — и настоящая цена
          каждой уборки.
        </p>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={`hairline rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
              filter === item
                ? "border-transparent bg-[var(--color-obsidian)] text-[var(--color-linen)]"
                : ""
            }`}
          >
            {item}
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
                  <dt>Площадь</dt>
                  <dd className="nums text-[var(--fg)]">{item.area} м²</dd>
                </div>
              )}
              <div className="flex gap-1.5">
                <dt>Время</dt>
                <dd className="nums text-[var(--fg)]">{item.hours} ч</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>Команда</dt>
                <dd className="nums text-[var(--fg)]">{item.crew} чел.</dd>
              </div>
            </dl>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
