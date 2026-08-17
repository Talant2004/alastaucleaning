"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { easeBrand } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { CONTACT, waLink } from "@/lib/contact";
import { useEstimate } from "./estimate-store";

const TIME_SLOTS = ["09:00", "11:00", "13:00", "15:00", "17:00"];

function nextDays(count: number) {
  const formatter = new Intl.DateTimeFormat("ru-KZ", { day: "numeric", month: "short" });
  const weekday = new Intl.DateTimeFormat("ru-KZ", { weekday: "short" });

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      iso: date.toISOString().slice(0, 10),
      label: formatter.format(date),
      weekday: weekday.format(date),
    };
  });
}

/** Пока нет Firebase — заявка уходит в WhatsApp готовым текстом, ничего не теряется. */
export function BookingForm({ onClose }: { onClose: () => void }) {
  const { whatsappText } = useEstimate();
  const days = nextDays(7);

  const [date, setDate] = useState(days[0].iso);
  const [time, setTime] = useState(TIME_SLOTS[1]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const selectedDay = days.find((day) => day.iso === date);

  const message = [
    whatsappText(),
    "",
    `Желаемая дата: ${selectedDay?.label ?? date}, ${time}`,
    name && `Имя: ${name}`,
    phone && `Телефон: ${phone}`,
    address && `Адрес: ${address}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeBrand }}
      className="surface mt-6 p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="h3">Когда вам удобно?</h3>
          <p className="muted mt-1 text-sm">
            Подтвердим слот в WhatsApp в течение {CONTACT.replyMinutes} минут.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Свернуть бронирование"
          className="hairline grid size-9 shrink-0 place-items-center rounded-full"
        >
          ×
        </button>
      </div>

      <fieldset className="mt-6">
        <legend className="eyebrow">Дата</legend>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {days.map((day) => (
            <button
              key={day.iso}
              type="button"
              onClick={() => setDate(day.iso)}
              aria-pressed={date === day.iso}
              className={`hairline flex min-w-18 shrink-0 flex-col items-center rounded-[18px] px-3 py-2.5 text-sm transition-colors duration-300 ${
                date === day.iso
                  ? "border-transparent bg-[var(--color-obsidian)] text-[var(--color-linen)]"
                  : ""
              }`}
            >
              <span className="eyebrow text-[0.55rem]">{day.weekday}</span>
              <span className="nums mt-0.5">{day.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="eyebrow">Время начала</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setTime(slot)}
              aria-pressed={time === slot}
              className={`hairline nums rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                time === slot
                  ? "border-transparent bg-[var(--color-obsidian)] text-[var(--color-linen)]"
                  : ""
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Field label="Как к вам обращаться" value={name} onChange={setName} placeholder="Айгерим" />
        <Field
          label="Телефон"
          value={phone}
          onChange={setPhone}
          placeholder="+7 (707) 000-00-00"
          type="tel"
        />
        <Field
          label="Адрес"
          value={address}
          onChange={setAddress}
          placeholder="ЖК, улица, дом, квартира"
          className="sm:col-span-2"
        />
      </div>

      <a
        {...waLink("estimate", message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("booking_submit", { date, time, hasName: Boolean(name) })}
        className="btn btn-primary mt-7 w-full"
      >
        Подтвердить бронь в WhatsApp
      </a>

      <p className="muted mt-3 text-center text-xs leading-relaxed">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <Link href="/privacy" className="underline-offset-2 hover:underline">
          политикой конфиденциальности
        </Link>
        : имя, телефон и адрес нужны только для выполнения заказа.
      </p>

      <p className="eyebrow mt-4 text-center text-[0.58rem] leading-relaxed">
        Ничего не спишется. Мы сверим детали и закрепим за вами команду
      </p>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="hairline mt-2 w-full rounded-[16px] bg-transparent px-4 py-3 text-sm outline-none transition-colors duration-300 placeholder:opacity-40 focus:border-[var(--color-sage-600)]"
      />
    </label>
  );
}
