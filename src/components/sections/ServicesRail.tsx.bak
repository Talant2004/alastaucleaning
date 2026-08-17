"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { CLEANING_TYPES, type CleaningTypeId } from "@/lib/pricing";
import { useEstimate } from "@/components/calculator/estimate-store";
import { MediaSlot } from "@/components/ui/MediaSlot";

type Card = {
  id: string;
  title: string;
  kz: string;
  tagline: string;
  price: string;
  includes: readonly string[];
  brief: string;
  addType?: CleaningTypeId;
};

const EXTRA_CARDS: Card[] = [
  {
    id: "textile",
    title: "Химчистка мебели",
    kz: "Жиһаз химтазалау",
    tagline: "Диваны, матрасы, кресла, стулья",
    price: "диван 13 000 ₸ · матрас 10 000 ₸",
    includes: [
      "Экстракторная чистка с горячей водой",
      "Удаление запахов и следов животных",
      "Сушка 4–6 часов, без разводов",
      "Кресла от 5 000 ₸, стулья от 1 000 ₸",
    ],
    brief: "ВИДЕО: экстрактор снимает пятно с ткани, макро, замедление",
  },
  {
    id: "balcony",
    title: "Балкон",
    kz: "Балкон",
    tagline: "Фиксированная стоимость",
    price: "5 000 ₸",
    includes: [
      "Мытьё остекления внутри",
      "Пол, подоконник, откосы",
      "Вынос и протирка хранимых вещей",
      "Балкон больше стандарта считаем по м²",
    ],
    brief: "ФОТО: чистый балкон против света, вид на город Алматы",
  },
];

export function ServicesRail() {
  const wrapper = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapper, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-64%"]);

  const { setType } = useEstimate();

  const cards: Card[] = [
    ...CLEANING_TYPES.map((type) => ({
      id: type.id,
      title: type.ru,
      kz: type.kz,
      tagline: type.tagline,
      price: `${type.perM2} ₸ / м²`,
      includes: type.includes,
      brief:
        type.id === "postRepair"
          ? "ВИДЕО: строительная пыль под пылесосом, контровой свет"
          : "ВИДЕО: солнечный блик на чистом полу, тюль дышит",
      addType: type.id,
    })),
    ...EXTRA_CARDS,
  ];

  const addToCalc = (type?: CleaningTypeId) => {
    if (type) setType(type);
    document.querySelector("#calc")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="services" className="border-y border-[var(--hairline)]">
      {/* Пин работает на десктопе; на мобиле деградирует в нативный snap-скролл */}
      <div ref={wrapper} className="relative hidden h-[420vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="shell">
            <p className="eyebrow">Тарифы и услуги</p>
            <h2 className="h2 mt-4 max-w-[20ch]">Четыре сценария чистоты</h2>
            <p className="muted mt-4 max-w-[46ch]">
              Выберите свой — и добавьте прямо в расчёт, не заполняя заново.
            </p>
          </div>

          <motion.ul
            style={{ x: reduce ? "0%" : x }}
            className="mt-10 flex gap-5 pl-[max(1.25rem,calc((100vw-1320px)/2+3.5rem))]"
          >
            {cards.map((card, index) => (
              <ServiceCard key={card.id} card={card} index={index} onAdd={addToCalc} />
            ))}
          </motion.ul>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="shell py-16">
          <p className="eyebrow">Тарифы и услуги</p>
          <h2 className="h2 mt-4">Четыре сценария чистоты</h2>
        </div>
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-16">
          {cards.map((card, index) => (
            <ServiceCard key={card.id} card={card} index={index} onAdd={addToCalc} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({
  card,
  index,
  onAdd,
}: {
  card: Card;
  index: number;
  onAdd: (type?: CleaningTypeId) => void;
}) {
  return (
    <li className="surface flex w-[82vw] shrink-0 snap-center flex-col p-6 sm:w-96 lg:w-[26rem]">
      <div className="flex items-start justify-between">
        <span className="font-display text-4xl text-[var(--color-brass)]">
          0{index + 1}
        </span>
        <span className="eyebrow text-right text-[0.6rem]">{card.kz}</span>
      </div>

      <MediaSlot brief={card.brief} ratio="16 / 10" className="mt-5" />

      <h3 className="h3 mt-6">{card.title}</h3>
      <p className="muted mt-1 text-sm">{card.tagline}</p>
      <p className="nums mt-4 text-lg text-[var(--color-sage-600)]">{card.price}</p>

      <ul className="muted mt-5 flex-1 space-y-2 text-sm">
        {card.includes.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="mt-2 block size-1 shrink-0 rounded-full bg-[var(--color-brass)]" />
            {item}
          </li>
        ))}
      </ul>

      <button type="button" onClick={() => onAdd(card.addType)} className="btn btn-ghost mt-7 w-full">
        Добавить в расчёт
      </button>
    </li>
  );
}
