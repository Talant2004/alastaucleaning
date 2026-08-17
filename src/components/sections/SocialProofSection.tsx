"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";

type Guarantee = { title: string; note: string };
type Testimonial = { name: string; context: string; quote: string };

export function SocialProofSection() {
  const t = useTranslations("socialProof");
  const guarantees = t.raw("guarantees") as Guarantee[];
  const fallback = t.raw("testimonials") as Testimonial[];
  const [testimonials, setTestimonials] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { reviews?: Testimonial[] } | null) => {
        if (cancelled || !data?.reviews?.length) return;
        setTestimonials(
          data.reviews.map((item) => ({
            name: item.name,
            context: item.context,
            quote: item.quote,
          })),
        );
      })
      .catch(() => {
        /* оставляем тексты из messages */
      });
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
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="surface flex flex-col justify-between p-6">
            <p className="eyebrow text-[0.6rem]">{t("ratingLabel")}</p>
            <p className="nums mt-6 text-5xl">4.9</p>
            <p className="muted mt-2 text-xs">{t("ratingNote")}</p>
            <p className="eyebrow mt-6 text-[0.55rem] leading-relaxed">{t("ratingHint")}</p>
          </Reveal>

          {testimonials.map((item, index) => (
            <Reveal as="article" key={`${item.name}-${index}`} index={index + 1} className="surface flex flex-col p-6">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-[color-mix(in_oklab,var(--color-brass)_50%,transparent)] text-sm"
                >
                  {item.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="muted truncate text-xs">{item.context}</p>
                </div>
              </div>

              <blockquote className="muted mt-5 flex-1 text-sm leading-relaxed">
                «{item.quote}»
              </blockquote>

              <p className="eyebrow mt-5 text-[0.55rem]">{t("videoPlaceholder")}</p>
            </Reveal>
          ))}
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item, index) => (
            <Reveal as="li" key={item.title} index={index} className="flex gap-3 py-2">
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
                <p className="text-sm">{item.title}</p>
                <p className="muted text-xs">{item.note}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
