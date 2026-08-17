import { Reveal } from "@/components/ui/Reveal";

const TESTIMONIALS = [
  {
    name: "Асель",
    context: "Генеральная, 2-комн., ЖК «Есентай»",
    quote:
      "Заказывала перед приездом родителей. Сделали за 5 часов, показали фото по каждой зоне. Аластау в конце — мама расплакалась, сказала, дом задышал как в детстве.",
  },
  {
    name: "Тимур",
    context: "После ремонта, 96 м²",
    quote:
      "Боялся, что останется пыль в углах и на люстрах. Приняли по чек-листу вместе, нашёл два замечания — переделали на месте, без разговоров.",
  },
  {
    name: "Гүлназ",
    context: "Влажная уборка, каждые 2 недели",
    quote:
      "Приходит одна и та же команда, я уже не сижу дома во время уборки. Отдельное спасибо, что средства без запаха — у сына астма.",
  },
];

const GUARANTEES = [
  { title: "Договор на каждую уборку", note: "с составом работ и суммой" },
  { title: "Материальная ответственность", note: "повредили — компенсируем" },
  { title: "Переделка 48 часов", note: "бесплатно и без споров" },
  { title: "Цена не меняется", note: "после расчёта доплат нет" },
];

export function SocialProofSection() {
  return (
    <section id="reviews" className="border-y border-[var(--hairline)] py-24 md:py-32">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Социальные доказательства</p>
          <h2 className="h2 mt-5 max-w-[20ch]">1 300 домов. 92% заказывают снова</h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="surface flex flex-col justify-between p-6">
            <p className="eyebrow text-[0.6rem]">Рейтинг 2GIS</p>
            <p className="nums mt-6 text-5xl">4.9</p>
            <p className="muted mt-2 text-xs">137 оценок · Алматы</p>
            <p className="eyebrow mt-6 text-[0.55rem] leading-relaxed">
              Ставим живой виджет платформы — рейтинг должен проверяться в один клик
            </p>
          </Reveal>

          {TESTIMONIALS.map((item, index) => (
            <Reveal as="article" key={item.name} index={index + 1} className="surface flex flex-col p-6">
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

              <p className="eyebrow mt-5 text-[0.55rem]">
                Место под вертикальное видео 9:16
              </p>
            </Reveal>
          ))}
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((item, index) => (
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
