import type { Transition, Variants } from "motion/react";

export const easeBrand = [0.16, 1, 0.3, 1] as const;

export const base: Transition = { duration: 0.52, ease: easeBrand };

/** Стагерим строки и слова, не буквы: кириллица по буквам читается плохо. */
export const lineReveal: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: (i: number = 0) => ({
    y: "0%",
    opacity: 1,
    transition: { ...base, duration: 0.9, delay: 0.07 * i },
  }),
};

export const cardRise: Variants = {
  hidden: { y: 28, opacity: 0, filter: "blur(6px)" },
  show: (i: number = 0) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { ...base, delay: 0.08 * i },
  }),
};

export const fadeUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: base },
};

export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.6, ease: "easeInOut" } },
};

export const viewportOnce = { once: true, amount: 0.3 } as const;
