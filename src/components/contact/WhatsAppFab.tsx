"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT, WA_TEXTS, isWorkingHours, waLink } from "@/lib/contact";
import { track } from "@/lib/analytics";
import { easeBrand } from "@/lib/motion";
import { useEstimate } from "@/components/calculator/estimate-store";
import { WhatsAppIcon } from "./WhatsAppIcon";

const HINT_KEY = "alas:wa-hint-dismissed";

export function WhatsAppFab() {
  const { touched } = useEstimate();
  const [visible, setVisible] = useState(false);
  const [hint, setHint] = useState(false);

  // Кнопка появляется только после скролла, поэтому к этому моменту мы уже на клиенте
  // и расхождения с серверным рендером быть не может.
  const working = visible ? isWorkingHours() : true;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Подсказка показывается один раз за сессию и только тем, кто не тронул калькулятор.
  useEffect(() => {
    if (sessionStorage.getItem(HINT_KEY)) return;

    const timer = window.setTimeout(() => {
      if (!touched) setHint(true);
    }, 25_000);

    return () => window.clearTimeout(timer);
  }, [touched]);

  const dismissHint = () => {
    setHint(false);
    sessionStorage.setItem(HINT_KEY, "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.45, ease: easeBrand }}
          className="fixed right-6 bottom-6 z-80 hidden items-end gap-3 md:flex"
        >
          <AnimatePresence>
            {hint && (
              <motion.div
                initial={{ opacity: 0, x: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.5, ease: easeBrand }}
                className="glass mb-1 max-w-70 rounded-[var(--radius-card)] p-4 pr-9 shadow-[var(--shadow-lift)]"
              >
                <p className="text-sm leading-snug">
                  Не хотите считать? Напишите — назовём цену сами.
                </p>
                <p className="eyebrow mt-2 text-[0.65rem]">
                  {working
                    ? `Отвечаем за ${CONTACT.replyMinutes} минут`
                    : "Ответим утром первым сообщением"}
                </p>
                <button
                  type="button"
                  onClick={dismissHint}
                  aria-label="Скрыть подсказку"
                  className="absolute top-2.5 right-3 text-lg leading-none opacity-50 transition-opacity hover:opacity-100"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <a
            {...waLink("fab", WA_TEXTS.fab)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track("whatsapp_click", { source: "fab" });
              dismissHint();
            }}
            aria-label={`Написать в WhatsApp: ${CONTACT.phoneDisplay}`}
            className="group relative grid size-14 place-items-center rounded-full border border-[color-mix(in_oklab,var(--color-brass)_55%,transparent)] bg-[var(--color-obsidian)] text-[var(--color-linen)] shadow-[var(--shadow-lift)] transition-transform duration-300 ease-[var(--ease-brand)] hover:scale-[1.06]"
          >
            <WhatsAppIcon className="size-6" />
            <span
              aria-hidden
              className={`absolute -top-0.5 -right-0.5 size-2.5 rounded-full ${
                working
                  ? "animate-(--animate-ember-pulse) bg-[var(--color-ember-300)]"
                  : "bg-[var(--color-silver)]"
              }`}
            />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
