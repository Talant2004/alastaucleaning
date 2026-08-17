"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  AREA_PRESETS,
  ALASTAU_OPTION_PRICE,
  BALCONY_FLAT_PRICE,
  BALCONY_STANDARD_M2,
  CLEANING_TYPES,
  EXTRAS,
  formatTenge,
  getCleaningType,
  isAlastauFree,
} from "@/lib/pricing";
import { WA_TEXTS } from "@/lib/contact";
import { easeBrand } from "@/lib/motion";
import { useEstimate } from "@/components/calculator/estimate-store";
import { EstimateReceipt } from "@/components/calculator/EstimateReceipt";
import { BookingForm } from "@/components/calculator/BookingForm";
import { WhatsAppButton, PhoneLink } from "@/components/contact/WhatsAppButton";

export function CalculatorSection() {
  const {
    state,
    setType,
    setArea,
    toggleBalcony,
    setBalconyArea,
    setExtra,
    toggleAlastau,
  } = useEstimate();
  const [booking, setBooking] = useState(false);
  const cleaningType = getCleaningType(state.type);
  const balconyOversize = state.balconyArea > BALCONY_STANDARD_M2;
  const balconyAmount = balconyOversize
    ? state.balconyArea * cleaningType.perM2
    : BALCONY_FLAT_PRICE;

  return (
    <section id="calc" className="shell py-24 md:py-32">
      <div className="max-w-[62ch]">
        <p className="eyebrow">Тазалық конфигураторы</p>
        <h2 className="h2 mt-5">Соберите свою уборку. Цена — сразу, без звонков</h2>
        <p className="muted mt-5">
          Никаких «приедем и посмотрим». Итог из калькулятора фиксируется в договоре.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          {/* Шаг 1 — тип уборки */}
          <fieldset>
            <legend className="eyebrow">Шаг 1 · Тип уборки</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {CLEANING_TYPES.map((type) => {
                const active = state.type === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setType(type.id)}
                    aria-pressed={active}
                    className={`surface relative overflow-hidden p-5 text-left transition-all duration-500 ease-[var(--ease-brand)] hover:-translate-y-1 ${
                      active
                        ? "border-[var(--color-sage-600)] shadow-[var(--shadow-lift)]"
                        : "hover:border-[var(--color-sage-400)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="type-glow"
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[var(--color-ember-600)] to-[var(--color-ember-300)]"
                      />
                    )}
                    <span className="eyebrow text-[0.58rem]">{type.kz}</span>
                    <span className="h3 mt-2 block text-lg">{type.ru}</span>
                    <span className="nums mt-3 block text-sm text-[var(--color-sage-600)]">
                      {type.perM2} ₸ / м²
                    </span>
                    <span className="muted mt-2 block text-xs">{type.tagline}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Шаг 2 — площадь */}
          <fieldset className="mt-10">
            <legend className="eyebrow">Шаг 2 · Площадь</legend>

            <div className="mt-4 flex flex-wrap gap-2">
              {AREA_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setArea(preset.m2)}
                  aria-pressed={state.area === preset.m2}
                  className={`hairline rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                    state.area === preset.m2
                      ? "border-transparent bg-[var(--color-obsidian)] text-[var(--color-linen)]"
                      : ""
                  }`}
                >
                  {preset.label}
                  <span className="nums muted ml-1.5 text-xs">{preset.m2} м²</span>
                </button>
              ))}
            </div>

            <div className="surface mt-4 flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
              <label className="flex items-center gap-3">
                <span className="eyebrow whitespace-nowrap">Точная площадь</span>
                <input
                  type="number"
                  min={20}
                  max={400}
                  value={state.area}
                  onChange={(event) => setArea(Number(event.target.value))}
                  className="nums hairline w-24 rounded-[14px] bg-transparent px-3 py-2 text-center text-lg outline-none focus:border-[var(--color-sage-600)]"
                />
                <span className="muted text-sm">м²</span>
              </label>

              <input
                type="range"
                min={20}
                max={300}
                step={1}
                value={state.area}
                onChange={(event) => setArea(Number(event.target.value))}
                aria-label="Площадь помещения в квадратных метрах"
                className="h-1 w-full flex-1 cursor-pointer appearance-none rounded-full bg-[var(--hairline)] accent-[var(--color-sage-600)]"
              />
            </div>
          </fieldset>

          {/* Шаг 3 — балкон: как квартира — всегда видно м² и формулу цены */}
          <fieldset className="mt-10">
            <legend className="eyebrow">Шаг 3 · Балкон</legend>
            <div className="surface mt-4 space-y-4 p-5">
              <label className="flex cursor-pointer items-center gap-3">
                <Switch checked={state.balcony} onChange={toggleBalcony} />
                <span className="text-sm">
                  Добавить балкон
                  <span className="muted block text-xs">
                    До {BALCONY_STANDARD_M2} м² — {formatTenge(BALCONY_FLAT_PRICE)}. Больше —
                    площадь × {cleaningType.perM2} ₸ / м²
                  </span>
                </span>
              </label>

              {state.balcony && (
                <div className="flex flex-col gap-4 border-t border-[var(--hairline)] pt-4 sm:flex-row sm:items-center">
                  <label className="flex items-center gap-3">
                    <span className="eyebrow whitespace-nowrap">Площадь балкона</span>
                    <input
                      type="number"
                      min={2}
                      max={40}
                      value={state.balconyArea}
                      onChange={(event) => setBalconyArea(Number(event.target.value))}
                      className="nums hairline w-20 rounded-[14px] bg-transparent px-3 py-2 text-center outline-none focus:border-[var(--color-sage-600)]"
                    />
                    <span className="muted text-sm">м²</span>
                  </label>

                  <input
                    type="range"
                    min={2}
                    max={25}
                    step={1}
                    value={state.balconyArea}
                    onChange={(event) => setBalconyArea(Number(event.target.value))}
                    aria-label="Площадь балкона в квадратных метрах"
                    className="h-1 w-full flex-1 cursor-pointer appearance-none rounded-full bg-[var(--hairline)] accent-[var(--color-sage-600)]"
                  />

                  <p className="nums shrink-0 text-sm text-[var(--color-sage-600)]">
                    {balconyOversize
                      ? `${state.balconyArea} м² × ${cleaningType.perM2} ₸ = ${formatTenge(balconyAmount)}`
                      : `${state.balconyArea} м² · ${formatTenge(BALCONY_FLAT_PRICE)}`}
                  </p>
                </div>
              )}
            </div>
          </fieldset>

          {/* Шаг 4 — допы */}
          <fieldset className="mt-10">
            <legend className="eyebrow">Шаг 4 · Дополнительно</legend>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {EXTRAS.map((extra) => {
                const qty = state.extras[extra.id] ?? 0;
                const custom = extra.price === null;

                return (
                  <li
                    key={extra.id}
                    className={`surface flex items-center justify-between gap-4 p-4 transition-colors duration-400 ${
                      qty > 0 ? "border-[var(--color-sage-400)]" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm">{extra.title}</p>
                      <p className="nums muted text-xs">
                        {custom
                          ? "рассчитаем на объекте"
                          : `${extra.from ? "от " : ""}${formatTenge(extra.price!)} / ${extra.unit}`}
                      </p>
                    </div>

                    {custom ? (
                      <Switch checked={qty > 0} onChange={() => setExtra(extra.id, qty > 0 ? 0 : 1)} />
                    ) : (
                      <Stepper
                        value={qty}
                        max={extra.max ?? 10}
                        onChange={(next) => setExtra(extra.id, next)}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </fieldset>

          {/* Шаг 5 — Аластау */}
          <fieldset className="mt-10">
            <legend className="eyebrow">Шаг 5 · Фирменный ритуал</legend>

            <motion.div
              animate={{
                backgroundPosition: state.alastau ? "100% 50%" : "0% 50%",
              }}
              transition={{ duration: 0.6, ease: easeBrand }}
              className="surface mt-4 flex flex-wrap items-center justify-between gap-4 overflow-hidden p-5"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, transparent 0%, transparent 45%, color-mix(in oklab, var(--color-ember-300) 16%, transparent) 75%, color-mix(in oklab, var(--color-ember-500) 12%, transparent) 100%)",
                backgroundSize: "260% 100%",
              }}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <Switch checked={state.alastau} onChange={toggleAlastau} accent />
                <span className="text-sm">
                  Обряд «Аластау» — окуривание адыраспаном
                  <span className="muted mt-0.5 block text-xs">
                    6–8 минут после уборки. Есть версия без дыма — гидролат.
                  </span>
                </span>
              </label>

              <span
                className={`eyebrow rounded-full px-3 py-1.5 text-[0.58rem] ${
                  isAlastauFree(state.type)
                    ? "bg-[var(--color-ember-500)] text-[var(--color-obsidian)]"
                    : "hairline"
                }`}
              >
                {isAlastauFree(state.type)
                  ? "В подарок"
                  : ALASTAU_OPTION_PRICE === null
                    ? "Уточним"
                    : formatTenge(ALASTAU_OPTION_PRICE)}
              </span>
            </motion.div>
          </fieldset>

          {booking && <BookingForm onClose={() => setBooking(false)} />}

          {/* Выход для тех, кому калькулятор неудобен */}
          <div className="surface mt-10 flex flex-col gap-5 border-[color-mix(in_oklab,var(--color-brass)_45%,transparent)] p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="h3 text-xl">Не хочется считать самому?</h3>
              <p className="muted mt-2 max-w-[52ch] text-sm">
                Напишите в WhatsApp или позвоните — задам 3 вопроса и назову точную сумму за пару
                минут. Считать ничего не нужно.
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2">
              <WhatsAppButton
                source="calc_fallback"
                text={WA_TEXTS.calcFallback}
                label="Написать в WhatsApp"
                variant="brass"
              />
              <PhoneLink source="calc_fallback" className="eyebrow pl-1 text-[0.62rem]" />
            </div>
          </div>
        </div>

        <div>
          <EstimateReceipt onBook={() => setBooking(true)} />
        </div>
      </div>
    </section>
  );
}

function Switch({
  checked,
  onChange,
  accent = false,
}: {
  checked: boolean;
  onChange: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-400 ease-[var(--ease-brand)] ${
        checked
          ? accent
            ? "border-transparent bg-[var(--color-ember-500)]"
            : "border-transparent bg-[var(--color-sage-600)]"
          : "border-[var(--hairline)] bg-transparent"
      }`}
    >
      <motion.span
        animate={{ x: checked ? 21 : 3 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className={`absolute top-1/2 block size-5 -translate-y-1/2 rounded-full ${
          checked ? "bg-[var(--color-linen)]" : "bg-[var(--color-silver)]"
        }`}
      />
    </button>
  );
}

function Stepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="hairline flex shrink-0 items-center rounded-full">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        aria-label="Убрать одну единицу"
        className="grid size-9 place-items-center rounded-full text-lg disabled:opacity-25"
      >
        −
      </button>
      <span className="nums w-7 text-center text-sm">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Добавить одну единицу"
        className="grid size-9 place-items-center rounded-full text-lg disabled:opacity-25"
      >
        +
      </button>
    </div>
  );
}
