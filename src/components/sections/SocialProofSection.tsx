"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

type Guarantee = { title: string; note: string };
type Testimonial = { name: string; context: string; quote: string };

export function SocialProofSection() {
  const t = useTranslations("socialProof");
  const guarantees = t.raw("guarantees") as Guarantee[];
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Отзывы показываем только опубликованные в админке — никаких заглушек
  useEffect(() => {
    let cancelled = false;
    void fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { reviews?: Testimonial[] } | null) => {
        if (cancelled || !data?.reviews?.length) return;
        setTestimonials(data.reviews);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="reviews" className="border-y border-[var(--hairline)] py-24 md:py-32">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="h2 mt-5 max-w-[20ch]">{t("h2")}</h2>
          <p className="muted mt-5 max-w-[54ch]">{t("sub")}</p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item, index) => (
            <Reveal as="li" key={item.title} index={index} className="surface flex gap-3 p-6">
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                fill="none"
                strokeWidth="1"
                className="mt-0.5 size-6 shrink-0 stroke-[var(--color-brass)]"
              >
                <path d="M12 2.5 20 6v6.4c0 4.3-3.2 7.6-8 9.1-4.8-1.5-8-4.8-8-9.1V6l8-3.5Z" />
                <path d="m8.5 12.4 2.6 2.6 5-5.4" />
              </svg>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="muted mt-1 text-sm">{item.note}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        {testimonials.length > 0 && (
          <>
            <h3 className="h3 mt-16">{t("reviewsTitle")}</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item, index) => (
                <Reveal
                  as="article"
                  key={`${item.name}-${index}`}
                  index={index}
                  className="surface flex flex-col p-6"
                >
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.context ? <p className="muted text-xs">{item.context}</p> : null}
                  <blockquote className="muted mt-4 flex-1 text-sm leading-relaxed">
                    «{item.quote}»
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
