"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { easeBrand } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { CONTACT, waLink } from "@/lib/contact";
import { fallbackSlots, type DayOption, type SlotsPayload } from "@/lib/slots";
import { useEstimate } from "./estimate-store";

export function BookingForm({ onClose }: { onClose: () => void }) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const { state, estimate, whatsappText } = useEstimate();
  const initial = fallbackSlots(locale === "kz" ? "kk-KZ" : "ru-KZ");

  const [slots, setSlots] = useState<SlotsPayload>(initial);
  const [date, setDate] = useState(initial.days[0]?.iso ?? "");
  const [time, setTime] = useState(initial.times[1] ?? initial.times[0] ?? "11:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    let cancelled = false;

    void fetch(`/api/slots?locale=${locale}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SlotsPayload | null) => {
        if (cancelled || !data?.days?.length || !data.times?.length) return;
        setSlots(data);
        setDate((prev) => (data.days.some((d) => d.iso === prev) ? prev : data.days[0].iso));
        setTime((prev) => (data.times.includes(prev) ? prev : data.times[1] ?? data.times[0]));
      })
      .catch(() => {
        /* fallback already in state */
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const selectedDay: DayOption | undefined = slots.days.find((day) => day.iso === date);
  const timeOptions = selectedDay?.times?.length ? selectedDay.times : slots.times;
  const timeOptionsKey = timeOptions.join("|");

  useEffect(() => {
    const options = timeOptionsKey.split("|").filter(Boolean);
    if (!options.length) return;
    if (!options.includes(time)) {
      setTime(options[1] ?? options[0] ?? "11:00");
    }
  }, [time, timeOptionsKey]);

  const message = [
    whatsappText(),
    "",
    `Дата: ${selectedDay?.label ?? date}, ${time}`,
    name && `Имя: ${name}`,
    phone && `Телефон: ${phone}`,
    address && `Адрес: ${address}`,
  ]
    .filter(Boolean)
    .join("\n");

  function submitBooking() {
    track("booking_submit", { date, time, hasName: Boolean(name) });

    void fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        time,
        name,
        phone,
        address,
        message,
        locale,
        estimate: {
          type: state.type,
          area: state.area,
          balcony: state.balcony,
          balconyArea: state.balconyArea,
          extras: state.extras,
          alastau: state.alastau,
          total: estimate.total,
          hasCustomItems: estimate.hasCustomItems,
        },
      }),
    }).catch(() => {
      /* WhatsApp всё равно открывается — Firestore не блокирует бронь */
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeBrand }}
      className="surface mt-6 p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="h3">{t("title")}</h3>
          <p className="muted mt-1 text-sm">{t("sub", { minutes: CONTACT.replyMinutes })}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="x"
          className="hairline grid size-9 shrink-0 place-items-center rounded-full"
        >
          x
        </button>
      </div>

      <fieldset className="mt-6">
        <legend className="eyebrow">{t("date")}</legend>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {slots.days.map((day) => (
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
        <legend className="eyebrow">{t("time")}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {timeOptions.map((slot) => (
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
        <Field label={t("name")} value={name} onChange={setName} placeholder={t("namePh")} />
        <Field label={t("phone")} value={phone} onChange={setPhone} placeholder={t("phonePh")} type="tel" />
        <Field
          label={t("address")}
          value={address}
          onChange={setAddress}
          placeholder={t("addressPh")}
          className="sm:col-span-2"
        />
      </div>

      <a
        {...waLink("estimate", message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={submitBooking}
        className="btn btn-primary mt-7 w-full"
      >
        {t("submit")}
      </a>

      <p className="muted mt-3 text-center text-xs leading-relaxed">
        {t.rich("consent", {
          privacy: (chunks) => (
            <Link href="/privacy" className="underline-offset-2 hover:underline">
              {chunks}
            </Link>
          ),
        })}
      </p>

      <p className="eyebrow mt-4 text-center text-[0.58rem] leading-relaxed">{t("note")}</p>
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
