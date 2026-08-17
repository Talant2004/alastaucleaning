"use client";

import { useTranslations } from "next-intl";
import { CONTACT } from "@/lib/contact";
import { COMPANY, companyRequisitesLine } from "@/lib/company";
import { Link } from "@/i18n/navigation";
import { PhoneLink, WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { Logo } from "./Logo";

const DISTRICTS = [
  "Медеуский",
  "Бостандыкский",
  "Алмалинский",
  "Ауэзовский",
  "Наурызбайский",
  "Турксибский",
  "Жетысуский",
  "Алатауский",
];

export function SiteFooter() {
  const t = useTranslations("footer");
  const tContact = useTranslations("contact");
  const payItems = t.raw("payItems") as string[];

  return (
    <footer className="border-t border-[var(--hairline)] pt-16 pb-28 md:pb-16">
      <div className="shell grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="muted mt-5 max-w-sm text-sm">{t("blurb")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <WhatsAppButton
              source="footer"
              textKey="footer"
              label={tContact("waWrite")}
              variant="brass"
              className="h-12 min-h-12 text-sm"
            />
            <PhoneLink source="footer" className="text-lg font-medium" />
          </div>
          <p className="eyebrow mt-4 text-[0.65rem]">
            {t("hours", {
              from: CONTACT.hoursFrom,
              to: CONTACT.hoursTo,
              minutes: CONTACT.replyMinutes,
            })}
          </p>
        </div>

        <div>
          <h3 className="eyebrow">{t("districts")}</h3>
          <ul className="muted mt-4 grid grid-cols-2 gap-1.5 text-sm">
            {DISTRICTS.map((district) => (
              <li key={district}>{district}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">{t("payment")}</h3>
          <ul className="muted mt-4 space-y-1.5 text-sm">
            {payItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="eyebrow mt-6 text-[0.6rem] leading-relaxed">
            {companyRequisitesLine()}
            {COMPANY.address ? (
              <>
                <br />
                {COMPANY.address}
              </>
            ) : null}
            <br />
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              {t("privacy")}
            </Link>
          </p>
        </div>
      </div>

      <div className="shell muted mt-14 flex flex-col gap-2 border-t border-[var(--hairline)] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {COMPANY.brand}. {t("tagline")}
        </span>
        <span>
          {COMPANY.city}, {COMPANY.country}
        </span>
      </div>
    </footer>
  );
}
