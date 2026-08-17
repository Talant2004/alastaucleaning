"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { haptic } from "@/lib/analytics";

type Props = {
  beforeBrief: string;
  afterBrief: string;
  radius?: number;
};

/**
 * «Чистая линза» вместо банального сплит-слайдера: внутри линзы — состояние ПОСЛЕ,
 * снаружи — приглушённое ДО с пыльным слоем. Клиент водит по фотографии чистотой.
 * Слои-градиенты заменяются на next/image, когда будут свои кадры.
 */
export function LensCompare({ beforeBrief, afterBrief, radius = 165 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [active, setActive] = useState(false);

  const x = useSpring(useMotionValue(38), { stiffness: 180, damping: 26 });
  const y = useSpring(useMotionValue(50), { stiffness: 180, damping: 26 });
  const r = useSpring(useMotionValue(reduce ? 999 : 0), { stiffness: 140, damping: 24 });

  const clip = useMotionTemplate`circle(${r}px at ${x}% ${y}%)`;

  // Автоподсказка: линза сама проезжает немного и замирает — без надписи «потяните»
  useEffect(() => {
    if (!inView || reduce) return;

    r.set(radius);
    const timer = window.setTimeout(() => x.set(58), 700);
    return () => window.clearTimeout(timer);
  }, [inView, reduce, r, radius, x]);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width) * 100);
    y.set(((event.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Сравнение: до и после уборки"
      tabIndex={0}
      onPointerMove={move}
      onPointerDown={(event) => {
        setActive(true);
        haptic();
        move(event);
      }}
      onPointerUp={() => setActive(false)}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => {
        setActive(false);
        x.set(48);
        y.set(50);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") x.set(Math.min(96, x.get() + 6));
        if (event.key === "ArrowLeft") x.set(Math.max(4, x.get() - 6));
      }}
      className="media-frame group aspect-[4/3] cursor-crosshair touch-none select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-sage-600)]"
    >
      {/* Слой ДО: пыль, приглушённый цвет */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, #cfc7ba 0%, #b9b1a4 42%, #9d968b 100%)",
          filter: "saturate(0.65) contrast(0.94)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-45 mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='d'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23d)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
      />
      <p className="eyebrow absolute bottom-5 left-5 max-w-[22ch] text-[0.58rem] text-[#3a352d]">
        {beforeBrief}
      </p>

      {/* Слой ПОСЛЕ: чистый свет, полный цвет */}
      <motion.div aria-hidden className="absolute inset-0" style={{ clipPath: clip }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 70% 15%, #fffdf7 0%, #f1efe7 45%, #dfe7e2 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "linear-gradient(200deg, transparent 40%, color-mix(in oklab, var(--color-glacier-200) 80%, transparent) 100%)",
          }}
        />
        <p className="eyebrow absolute top-5 left-5 text-[0.58rem] text-[var(--color-sage-900)]">
          {afterBrief}
        </p>
      </motion.div>

      {/* Обводка линзы */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-full border border-[rgba(255,255,255,0.7)] shadow-[0_0_40px_rgba(255,255,255,0.35)]"
        style={{
          left: useMotionTemplate`calc(${x}% - ${r}px)`,
          top: useMotionTemplate`calc(${y}% - ${r}px)`,
          width: useMotionTemplate`calc(${r}px * 2)`,
          height: useMotionTemplate`calc(${r}px * 2)`,
          opacity: active ? 0.9 : 0.5,
        }}
      />

      <span className="eyebrow glass absolute top-4 right-4 rounded-full px-3 py-1.5 text-[0.55rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        Ведите курсором
      </span>
    </div>
  );
}
