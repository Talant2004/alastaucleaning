import { BALCONY_FLAT_PRICE, BALCONY_STANDARD_M2, CLEANING_TYPES, EXTRAS, formatTenge, isAlastauFree } from "@/lib/pricing";
import { Reveal } from "@/components/ui/Reveal";

export function PricingSection() {
  return (
    <section id="pricing" className="shell py-24 md:py-32">
      <Reveal>
        <p className="eyebrow">Прайс</p>
        <h2 className="h2 mt-5 max-w-[22ch]">Цены без «от» и без сюрпризов</h2>
        <p className="muted mt-5 max-w-[54ch]">
          Тариф зависит только от типа уборки и площади. Всё остальное — ваш выбор, а не наша
          инициатива.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {CLEANING_TYPES.map((type, index) => (
          <Reveal
            key={type.id}
            index={index}
            className={`surface flex flex-col p-7 ${
              type.id === "general" ? "border-[var(--color-sage-600)]" : ""
            }`}
          >
            {type.id === "general" && (
              <span className="eyebrow mb-4 self-start rounded-full bg-[var(--color-sage-600)] px-3 py-1 text-[0.55rem] text-[var(--color-linen)]">
                Выбирают чаще всего
              </span>
            )}

            <span className="eyebrow text-[0.6rem]">{type.kz}</span>
            <h3 className="h3 mt-2">{type.ru}</h3>

            <p className="nums mt-6 text-4xl">
              {type.perM2} ₸
              <span className="muted ml-1 text-base">/ м²</span>
            </p>
            <p className="muted mt-2 text-xs">
              Пример: 62 м² — {formatTenge(type.perM2 * 62)}
            </p>

            <ul className="muted mt-7 flex-1 space-y-2.5 text-sm">
              {type.includes.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span
                    aria-hidden
                    className="mt-2 block size-1 shrink-0 rounded-full bg-[var(--color-brass)]"
                  />
                  {item}
                </li>
              ))}
            </ul>

            {isAlastauFree(type.id) && (
              <p className="mt-6 text-sm text-[var(--color-ember-500)]">
                Обряд «Аластау» — в подарок
              </p>
            )}

            <a href="#calc" className="btn btn-ghost mt-7 w-full">
              Рассчитать точно
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal className="surface mt-6 p-7">
        <h3 className="eyebrow">Дополнительные услуги</h3>
        <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {[
            ...EXTRAS.map((extra) => ({
              title: extra.title,
              price:
                extra.price === null
                  ? "индивидуально"
                  : `${extra.from ? "от " : ""}${formatTenge(extra.price)} / ${extra.unit}`,
            })),
            { title: "Балкон до среднего", price: `${formatTenge(BALCONY_FLAT_PRICE)} · до ${BALCONY_STANDARD_M2} м²` },
            {
              title: "Балкон больше среднего",
              price: "площадь × тариф уборки за м²",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="flex items-baseline justify-between gap-4 border-b border-dashed border-[var(--hairline)] pb-2.5 text-sm"
            >
              <span>{item.title}</span>
              <span className="nums muted shrink-0 text-right text-xs">{item.price}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
