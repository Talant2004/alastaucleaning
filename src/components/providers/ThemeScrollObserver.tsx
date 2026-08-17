"use client";

import { useEffect } from "react";

/**
 * Инверсия темы по скроллу: секции с data-theme-zone="night" гасят сайт в обсидиан.
 * IntersectionObserver вместо скролл-листенера — иначе на мобиле уходит кадр.
 */
export function ThemeScrollObserver() {
  useEffect(() => {
    const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-theme-zone]"));
    if (!zones.length) return;

    const visible = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(el);
          else visible.delete(el);
        }

        const night = Array.from(visible).some((el) => el.dataset.themeZone === "night");
        document.documentElement.dataset.theme = night ? "night" : "day";
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    zones.forEach((zone) => observer.observe(zone));

    return () => observer.disconnect();
  }, []);

  return null;
}
