"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { CLEANING_TYPES, isAlastauFree, type CleaningTypeId } from "@/lib/pricing";
import { useEstimate } from "@/components/calculator/estimate-store";
import { MediaSlot } from "@/components/ui/MediaSlot";

type Card = {
  id: string;
  title: string;
  tagline: string;
  price: string;
  includes: string[];
  image: string;
  addType?: CleaningTypeId;
};

type CardCopy = { title?: string; tagline: string; price?: string; includes: string[] };

const IMAGES: Record<string, string> = {
  wet: "/media/service-wet.jpg",
  general: "/media/service-general.jpg",
  postRepair: "/media/service-postrepair.jpg",
  textile: "/media/service-textile.jpg",
  balcony: "/media/service-balcony.jpg",
};

export function ServicesRail() {
  const t = useTranslations("services");
  const locale = useLocale();
  const wrapper = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapper, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-64%"]);

  const { setType, pricing } = useEstimate();
  const copy = t.raw("cards") as Record<string, CardCopy>;

  const cards: Card[] = [
    ...CLEANING_TYPES.map((type) => ({
      id: type.id,
      title: locale === "kz" ? type.kz : type.ru,
      tagline: copy[type.id].tagline,
      price: `${pricing.perM2[type.id]} ₸ / м²`,
      includes: copy[type.id].includes,
      image: IMAGES[type.id],
      addType: type.id,
    })),
    ...(["textile", "balcony"] as const).map((id) => ({
      id,
      title: copy[id].title ?? "",
      tagline: copy[id].tagline,
      price: copy[id].price ?? "",
      includes: copy[id].includes,
      image: IMAGES[id],
    })),
  ];

  const addToCalc = (type?: CleaningTypeId) => {
    if (type) setType(type);
    document.querySelector("#calc")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="services" className="border-y border-[var(--hairline)]">
      <div ref={wrapper} className="relative hidden h-[420vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="shell">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="h2 mt-4 max-w-[20ch]">{t("h2")}</h2>
            <p className="muted mt-4 max-w-[46ch]">{t("sub")}</p>
          </div>

          <motion.ul
            style={{ x: reduce ? "0%" : x }}
            className="mt-10 flex gap-5 pl-[max(1.25rem,calc((100vw-1320px)/2+3.5rem))]"
          >
            {cards.map((card, index) => (
              <ServiceCard
                key={card.id}
                card={card}
                index={index}
                onAdd={addToCalc}
                addLabel={t("addToCalc")}
                giftLabel={t("alastauGift")}
              />
            ))}
          </motion.ul>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="shell py-16">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="h2 mt-4">{t("h2")}</h2>
        </div>
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-16">
          {cards.map((card, index) => (
            <ServiceCard
              key={card.id}
              card={card}
              index={index}
              onAdd={addToCalc}
              addLabel={t("addToCalc")}
              giftLabel={t("alastauGift")}
            />
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
  addLabel,
  giftLabel,
}: {
  card: Card;
  index: number;
  onAdd: (type?: CleaningTypeId) => void;
  addLabel: string;
  giftLabel: string;
}) {
  return (
    <li className="surface flex w-[82vw] shrink-0 snap-center flex-col p-6 sm:w-96 lg:w-[26rem]">
      <span className="font-display text-4xl text-[var(--color-brass)]">0{index + 1}</span>

      <MediaSlot
        brief=""
        src={card.image}
        alt={card.title}
        ratio="16 / 10"
        className="mt-5"
      />

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

      {card.addType && isAlastauFree(card.addType) && (
        <p className="mt-5 text-sm text-[var(--color-ember-500)]">{giftLabel}</p>
      )}

      <button type="button" onClick={() => onAdd(card.addType)} className="btn btn-ghost mt-7 w-full">
        {addLabel}
      </button>
    </li>
  );
}
