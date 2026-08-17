"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { easeBrand } from "@/lib/motion";
import { formatTenge } from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { CONTACT, waLink } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/contact/WhatsAppIcon";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useEstimate } from "./estimate-store";

export function EstimateReceipt({ onBook }: { onBook: () => void }) {
  const t = useTranslations("calculator");
  const tCommon = useTranslations("common");
  const { estimate, whatsappText } = useEstimate();

  return (
    <div className="surface sticky top-28 p-6 shadow-[var(--shadow-lift)]">
      <div className="flex items-baseline justify-between">
        <h3 className="eyebrow">{t("receiptTitle")}</h3>
        <span className="eyebrow text-[0.6rem]">Алматы</span>
      </div>

      <motion.ul layout className="mt-6 space-y-3">
        <AnimatePresence initial={false}>
          {estimate.lines.map((line) => (
            <motion.li
              key={line.id}
              layout
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.42, ease: easeBrand }}
              className="flex items-start justify-between gap-4 border-b border-dashed border-[var(--hairline)] pb-3 text-sm"
            >
              <span className="max-w-[60%]">
                {line.title}
                {line.note && <span className="muted block text-xs">{line.note}</span>}
              </span>
              <span className="nums shrink-0 text-right">
                {line.amount === null
                  ? tCommon("onFact")
                  : line.amount === 0
                    ? "0 ₸"
                    : formatTenge(line.amount)}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="eyebrow text-[0.6rem]">{t("total")}</p>
          <AnimatedNumber value={estimate.total} className="text-3xl font-medium" />
        </div>
        <p className="muted whitespace-pre-line text-right text-xs leading-snug">
          {t("hoursCrew", { hours: estimate.hours, crew: estimate.crew })}
        </p>
      </div>

      {estimate.hasCustomItems && (
        <p className="muted mt-3 text-xs">{t("customNote")}</p>
      )}

      <button type="button" onClick={onBook} className="btn btn-primary mt-6 w-full">
        {t("book")}
      </button>

      <a
        {...waLink("estimate", whatsappText())}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { source: "estimate" })}
        aria-label={`${t("sendWa")}: ${CONTACT.phoneDisplay}`}
        className="btn btn-brass mt-2.5 w-full text-sm"
      >
        <WhatsAppIcon />
        {t("sendWa")}
      </a>

      <p className="eyebrow mt-4 text-center text-[0.58rem] leading-relaxed">{t("priceFixed")}</p>
    </div>
  );
}
