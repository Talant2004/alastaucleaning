"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { CONTACT } from "@/lib/contact";
import { easeBrand } from "@/lib/motion";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { LocaleSwitch } from "./LocaleSwitch";
import { Logo } from "./Logo";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tContact = useTranslations("contact");
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  const nav = [
    { href: "#services", label: t("services") },
    { href: "#alastau", label: t("alastau") },
    { href: "#calc", label: t("prices") },
    { href: "#cases", label: t("cases") },
    { href: "#team", label: t("team") },
    { href: "#faq", label: t("faq") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-90 transition-all duration-500 ease-[var(--ease-brand)] ${
        scrolled ? "glass py-2" : "py-4"
      }`}
    >
      <div className="shell flex items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-7 text-sm lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 transition-opacity hover:opacity-60"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden xl:block">
            <LocaleSwitch />
          </span>

          <WhatsAppButton
            source="header"
            textKey="header"
            label={tContact("wa")}
            showNumber
            variant="brass"
            className="hidden h-11 min-h-11 px-4 text-sm sm:inline-flex"
          />

          <a href="#calc" className="btn btn-primary hidden h-11 min-h-11 px-5 text-sm md:inline-flex">
            {t("calcCta")}
          </a>

          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-label={menu ? t("closeMenu") : t("openMenu")}
            aria-expanded={menu}
            className="hairline grid size-11 place-items-center rounded-full lg:hidden"
          >
            <span className="relative block h-2.5 w-4.5">
              <span
                className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ${
                  menu ? "translate-y-1.25 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 ${
                  menu ? "-translate-y-1.25 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: easeBrand }}
            className="glass shell mt-2 flex flex-col gap-1 py-4 lg:hidden"
          >
            <div className="mb-3">
              <LocaleSwitch />
            </div>
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenu(false)}
                className="h2 py-1 text-2xl"
              >
                {item.label}
              </a>
            ))}
            <p className="eyebrow mt-3">{CONTACT.phoneDisplay}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
