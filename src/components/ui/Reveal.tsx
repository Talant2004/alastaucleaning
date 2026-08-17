"use client";

import { motion, useReducedMotion } from "motion/react";
import { cardRise, easeBrand, viewportOnce } from "@/lib/motion";

export function Reveal({
  children,
  index = 0,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <Component
      variants={cardRise}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * Построчный reveal заголовка. Стагерим строки, а не буквы:
 * кириллица по буквам читается плохо и выглядит дёшево.
 */
export function RevealLines({
  lines,
  className = "",
  delay = 0,
}: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden py-[0.06em]">
          <motion.span
            className="block"
            initial={reduce ? { opacity: 0 } : { y: "110%", opacity: 0 }}
            whileInView={reduce ? { opacity: 1 } : { y: "0%", opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.95, ease: easeBrand, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
