"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { WA_TEXTS } from "@/lib/contact";
import { easeBrand, viewportOnce } from "@/lib/motion";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { MediaSlot } from "@/components/ui/MediaSlot";

const STEPS = [
  {
    kz: "Тазарту",
    ru: "Чистота",
    text: "Полная уборка по чек-листу: пыль, жир, налёт, текстиль. Всё, что видно, и всё, что не видно.",
  },
  {
    kz: "Аластау",
    ru: "Дым адыраспана",
    text: "Сушёный адыраспан тлеет в керамической чаше. Дым проносят по всем углам, проёмам и порогам — по солнцу, как это делали всегда.",
  },
  {
    kz: "Тыныс",
    ru: "Дыхание",
    text: "Проветривание, гидролат полыни и можжевельника — и карточка с «бата», добрым пожеланием вашему дому.",
  },
];

export function AlastauSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [botany, setBotany] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Дым идёт снизу вверх по мере скролла. Позже заменяется секвенцией
  // из 90 кадров реальной съёмки на чёрном бархате (см. docs/alas-frontend-spec.md, §6.1).
  const smokeY = useTransform(scrollYProgress, [0, 1], ["25%", "-35%"]);
  const smokeOpacity = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [0, 0.85, 0.7, 0.1]);
  const smokeScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.35]);
  const emberGlow = useTransform(scrollYProgress, [0.1, 0.45, 0.9], [0.15, 0.6, 0.2]);

  return (
    <section
      ref={ref}
      id="alastau"
      data-theme-zone="night"
      className="relative overflow-hidden py-28 md:py-40"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[var(--color-obsidian)]" />

      <motion.div
        aria-hidden
        style={{ y: reduce ? 0 : smokeY, opacity: reduce ? 0.35 : smokeOpacity, scale: reduce ? 1 : smokeScale }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[130%]"
      >
        <div
          className="absolute bottom-0 left-[18%] h-full w-[55%] blur-[80px]"
          style={{
            background:
              "linear-gradient(to top, rgba(242,237,228,0.22), rgba(242,237,228,0.08) 45%, transparent 78%)",
          }}
        />
        <div
          className="absolute bottom-0 right-[12%] h-[85%] w-[35%] blur-[70px]"
          style={{
            background:
              "linear-gradient(to top, rgba(185,154,107,0.24), rgba(185,154,107,0.06) 50%, transparent 80%)",
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        style={{ opacity: reduce ? 0.3 : emberGlow }}
        className="pointer-events-none absolute bottom-[-10%] left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full blur-[120px]"
      >
        <div className="size-full rounded-full bg-[var(--color-ember-600)]" />
      </motion.div>

      <div className="shell relative">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: easeBrand }}
          className="eyebrow text-[var(--color-brass)]"
        >
          Фирменный ритуал ALAS
        </motion.p>

        <div className="mt-6 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <h2 className="h2 max-w-[18ch]">
              Алас, алас —<br />
              <span className="italic text-[var(--color-ember-300)]">бәледен халас</span>
            </h2>

            <p className="muted mt-8 max-w-[50ch] text-lg">
              Обряд, которым наши бабушки очищали воздух в доме. Мы вернули его — как финальный,
              149-й пункт нашего чек-листа.
            </p>

            <ol className="mt-14 space-y-0">
              {STEPS.map((step, index) => (
                <motion.li
                  key={step.kz}
                  initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, ease: easeBrand }}
                  className="grid grid-cols-[auto_1fr] gap-6 border-t border-[var(--hairline)] py-7"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="nums font-mono text-xs text-[var(--color-brass)]">
                      0{index + 1}
                    </span>
                    <span
                      aria-hidden
                      className="w-px flex-1 bg-gradient-to-b from-[var(--color-brass)] to-transparent opacity-50"
                    />
                  </div>
                  <div>
                    <h3 className="h3">
                      {step.kz}{" "}
                      <span className="muted font-ui text-base font-normal">/ {step.ru}</span>
                    </h3>
                    <p className="muted mt-2 max-w-[46ch] text-sm leading-relaxed">{step.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>

            <div className="mt-10 border-t border-[var(--hairline)] pt-8">
              <button
                type="button"
                onClick={() => setBotany((v) => !v)}
                aria-expanded={botany}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="h3 text-xl">Это не магия. Это ботаника и уважение к традиции</span>
                <span
                  aria-hidden
                  className={`grid size-9 shrink-0 place-items-center rounded-full border border-[var(--hairline)] transition-transform duration-500 ease-[var(--ease-brand)] ${
                    botany ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              <motion.div
                initial={false}
                animate={{ height: botany ? "auto" : 0, opacity: botany ? 1 : 0 }}
                transition={{ duration: 0.55, ease: easeBrand }}
                className="overflow-hidden"
              >
                <p className="muted mt-5 max-w-[58ch] text-sm leading-relaxed">
                  Адыраспан (гармала) веками использовали как природный антисептик воздуха. Мы
                  проводим обряд аккуратно: 6–8 минут, чаша с песком, открытые окна, датчик дыма
                  прикрыт. Никакой эзотерики и никакого открытого огня в комнате.
                </p>
                <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-[var(--color-ember-300)]">
                  Есть версия без дыма — гидролат адыраспана. Для аллергиков, детских комнат и
                  офисов с пожарной сигнализацией.
                </p>
              </motion.div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#calc" className="btn btn-primary">
                Добавить обряд к уборке
              </a>
              <WhatsAppButton
                source="alastau"
                text={WA_TEXTS.alastau}
                label="Спросить про обряд"
                variant="brass"
              />
            </div>
          </div>

          <div className="lg:pt-10">
            <MediaSlot
              brief="ВИДЕО 40 сек: чистая комната → керамическая чаша → тлеющий уголёк адыраспана → дым по углам → открытое окно → карточка «бата» на столе"
              ratio="3 / 4"
              tone="warm"
            />
            <p className="eyebrow mt-5 text-[0.6rem] leading-relaxed">
              Снимаем сами, в реальных квартирах. Ни одного стокового кадра — иначе ритуал перестаёт
              быть вашим.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
