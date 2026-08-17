"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { CONTACT, WA_TEXTS } from "@/lib/contact";
import { easeBrand } from "@/lib/motion";
import { RevealLines } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";

const TRUST = [
  "от 650 ₸ / м² — цена в договоре",
  "паспорт и медсправка у каждого клинера",
  "материальная ответственность",
  "эко-состав: дети и питомцы",
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10">
      {/* Сцена первого экрана: свет сквозь чистое окно. Заменяется на видео 4K. */}
      <motion.div aria-hidden style={{ y, scale }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[var(--color-linen)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(85% 65% at 72% 8%, #fffdf7 0%, color-mix(in oklab, var(--color-glacier-200) 55%, #fffdf7) 38%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(196deg, transparent 34%, color-mix(in oklab, var(--color-sage-100) 70%, transparent) 62%, color-mix(in oklab, var(--color-sage-400) 30%, transparent) 100%)",
          }}
        />
        {/* Световой шафт от окна */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 2.4, ease: easeBrand }}
          className="absolute -top-40 right-[8%] h-[130%] w-[46%] rotate-12 blur-3xl"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,253,247,0.95), rgba(255,247,232,0.35) 55%, transparent)",
          }}
        />
        {/* Дымная струйка — намёк на Аластау уже в первом экране */}
        <motion.div
          animate={reduce ? undefined : { x: [0, 24, -12, 0], opacity: [0.12, 0.22, 0.14, 0.12] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-[14%] h-[60%] w-[22%] blur-3xl"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--color-ember-300) 45%, transparent), transparent 70%)",
          }}
        />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="shell relative pt-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeBrand, delay: 0.1 }}
          className="eyebrow"
        >
          Премиальный клининг · {CONTACT.city}
        </motion.p>

        <h1 className="h1 mt-6 max-w-[19ch]">
          <RevealLines
            lines={["Мы возвращаем дому", "не только чистоту."]}
            delay={0.15}
          />
          <span className="block text-[var(--color-sage-600)] italic">
            <RevealLines lines={["Мы возвращаем ему дыхание."]} delay={0.34} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeBrand, delay: 0.55 }}
          className="muted mt-8 max-w-[52ch] text-lg"
        >
          Профессиональная уборка по чек-листу из 148 пунктов — и завершающий обряд «Аластау»:
          окуривание адыраспаном. В подарок к каждой генеральной уборке.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeBrand, delay: 0.68 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <a href="#calc" className="btn btn-primary">
            Рассчитать стоимость — 30 секунд
          </a>

          <div className="flex flex-col gap-1.5">
            <WhatsAppButton
              source="hero"
              text={WA_TEXTS.hero}
              label="Спросить в WhatsApp"
              variant="ghost"
            />
            <span className="eyebrow pl-1 text-[0.6rem]">
              Отвечаем за {CONTACT.replyMinutes} минут · без калькулятора
            </span>
          </div>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: easeBrand, delay: 0.9 }}
          className="mt-14 grid gap-x-8 gap-y-3 border-t border-[var(--hairline)] pt-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TRUST.map((item) => (
            <li key={item} className="eyebrow flex items-start gap-2 text-[0.62rem] leading-relaxed">
              <span aria-hidden className="mt-1 block size-1 shrink-0 rounded-full bg-[var(--color-brass)]" />
              {item}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: easeBrand, delay: 1.1 }}
        className="glass shell pointer-events-none mt-10 hidden rounded-[var(--radius-card)] px-6 py-4 lg:mx-auto lg:mt-0 lg:block lg:w-auto lg:max-w-xs lg:self-end"
      >
        <p className="eyebrow text-[0.6rem]">Свободные слоты на неделю</p>
        <p className="nums mt-1 text-2xl">3 из 14</p>
        <p className="muted mt-1 text-xs">
          Бронь закрывается за 2 дня — команды выезжают по расписанию
        </p>
      </motion.aside>
    </section>
  );
}
