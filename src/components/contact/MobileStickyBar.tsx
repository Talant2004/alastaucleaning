"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT, WA_TEXTS, waLink } from "@/lib/contact";
import { track } from "@/lib/analytics";
import { easeBrand } from "@/lib/motion";
import { formatTenge } from "@/lib/pricing";
import { useEstimate } from "@/components/calculator/estimate-store";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function MobileStickyBar() {
  const { estimate, touched, whatsappText } = useEstimate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.45, ease: easeBrand }}
          className="glass safe-bottom fixed inset-x-0 bottom-0 z-80 flex gap-2 px-3 pt-3 md:hidden"
        >
          <a
            {...waLink("mobile_bar", touched ? whatsappText() : WA_TEXTS.mobileBar)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { source: "mobile_bar" })}
            aria-label={`Написать в WhatsApp: ${CONTACT.phoneDisplay}`}
            className="btn btn-brass flex-[0_0_38%] px-3 text-sm"
          >
            <WhatsAppIcon />
            <span>WhatsApp</span>
          </a>

          <a href="#calc" className="btn btn-primary flex-1 px-3 text-sm">
            {touched ? (
              <span className="flex flex-col items-center leading-tight">
                <span className="nums font-medium">{formatTenge(estimate.total)}</span>
                <span className="text-[0.65rem] opacity-70">Продолжить расчёт</span>
              </span>
            ) : (
              "Рассчитать за 30 секунд"
            )}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
