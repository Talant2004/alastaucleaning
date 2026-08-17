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
import { useTranslations } from "next-intl";
import { haptic } from "@/lib/analytics";

type Props = {
  beforeBrief: string;
  afterBrief: string;
  /** Базовый радиус на десктопе. На телефоне берётся сильно меньше. */
  radius?: number;
};

function useResponsiveLensRadius(desktopRadius: number) {
  const [radius, setRadius] = useState(desktopRadius);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      // На узком экране круг не должен закрывать «до» — иначе грязного не видно.
      if (w < 420) setRadius(48);
      else if (w < 640) setRadius(58);
      else if (w < 768) setRadius(78);
      else setRadius(desktopRadius);
    };
    compute();
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, [desktopRadius]);

  return radius;
}

/**
 * «Чистая линза»: внутри — ПОСЛЕ, снаружи — ДО.
 * На мобиле радиус маленький, чтобы всегда было видно оба состояния.
 */
export function LensCompare({ beforeBrief, afterBrief, radius = 140 }: Props) {
  const t = useTranslations("beforeAfter");
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [active, setActive] = useState(false);
  const lensRadius = useResponsiveLensRadius(radius);

  const x = useSpring(useMotionValue(32), { stiffness: 180, damping: 26 });
  const y = useSpring(useMotionValue(48), { stiffness: 180, damping: 26 });
  const r = useSpring(useMotionValue(reduce ? 999 : 0), { stiffness: 140, damping: 24 });

  const clip = useMotionTemplate`circle(${r}px at ${x}% ${y}%)`;

  useEffect(() => {
    if (!inView || reduce) return;
    r.set(lensRadius);
    const timer = window.setTimeout(() => x.set(42), 500);
    return () => window.clearTimeout(timer);
  }, [inView, reduce, r, lensRadius, x]);

  // Если повернули телефон — подтянуть радиус без скачка скролла
  useEffect(() => {
    if (!inView || reduce) return;
    r.set(lensRadius);
  }, [lensRadius, inView, reduce, r]);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width) * 100);
    y.set(((event.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label={t("compareAria")}
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
        x.set(36);
        y.set(48);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") x.set(Math.min(96, x.get() + 6));
        if (event.key === "ArrowLeft") x.set(Math.max(4, x.get() - 6));
        if (event.key === "ArrowDown") y.set(Math.min(96, y.get() + 6));
        if (event.key === "ArrowUp") y.set(Math.max(4, y.get() - 6));
        if (event.key === "Escape") {
          x.set(36);
          y.set(48);
          r.set(reduce ? 999 : lensRadius);
        }
      }}
      className="media-frame group aspect-[4/3] cursor-crosshair touch-none select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-sage-600)]"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "linear-gradient(155deg, #cfc7ba 0%, #b9b1a4 42%, #9d968b 100%)",
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
      <p className="eyebrow absolute bottom-4 left-4 z-10 max-w-[18ch] rounded-md bg-[rgba(247,244,239,0.72)] px-2 py-1 text-[0.55rem] text-[#3a352d] backdrop-blur-sm">
        {beforeBrief}
      </p>

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
        <p className="eyebrow absolute top-4 left-4 max-w-[18ch] rounded-md bg-[rgba(247,244,239,0.75)] px-2 py-1 text-[0.55rem] text-[var(--color-sage-900)] backdrop-blur-sm">
          {afterBrief}
        </p>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-full border border-[rgba(255,255,255,0.75)] shadow-[0_0_24px_rgba(255,255,255,0.3)]"
        style={{
          left: useMotionTemplate`calc(${x}% - ${r}px)`,
          top: useMotionTemplate`calc(${y}% - ${r}px)`,
          width: useMotionTemplate`calc(${r}px * 2)`,
          height: useMotionTemplate`calc(${r}px * 2)`,
          opacity: active ? 0.95 : 0.65,
        }}
      />

      <span className="eyebrow glass absolute top-3 right-3 rounded-full px-2.5 py-1 text-[0.5rem] opacity-100 md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100">
        {t("dragHint")}
      </span>
    </div>
  );
}
