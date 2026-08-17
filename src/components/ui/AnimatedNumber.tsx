"use client";

import { useEffect } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";

export function AnimatedNumber({
  value,
  suffix = " ₸",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 120, damping: 22, mass: 0.6 });
  const text = useTransform(spring, (latest) =>
    `${new Intl.NumberFormat("ru-KZ").format(Math.round(latest))}${suffix}`,
  );

  useEffect(() => {
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [value, spring, reduce]);

  return (
    <motion.span className={`nums ${className}`} aria-live="polite">
      {text}
    </motion.span>
  );
}
