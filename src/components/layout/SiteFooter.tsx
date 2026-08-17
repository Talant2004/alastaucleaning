import Link from "next/link";
import { CONTACT, WA_TEXTS } from "@/lib/contact";
import { COMPANY, companyRequisitesLine } from "@/lib/company";
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
  return (
    <footer className="border-t border-[var(--hairline)] pt-16 pb-28 md:pb-16">
      <div className="shell grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="muted mt-5 max-w-sm text-sm">
            Премиальный клининг в Алматы с завершающим обрядом «Аластау». Работаем по договору,
            с материальной ответственностью и фиксированной ценой.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <WhatsAppButton
              source="footer"
              text={WA_TEXTS.footer}
              label="Написать в WhatsApp"
              variant="brass"
              className="h-12 min-h-12 text-sm"
            />
            <PhoneLink source="footer" className="text-lg font-medium" />
          </div>
          <p className="eyebrow mt-4 text-[0.65rem]">
            Ежедневно {CONTACT.hoursFrom}:00 — {CONTACT.hoursTo}:00 · ответ за {CONTACT.replyMinutes}{" "}
            минут
          </p>
        </div>

        <div>
          <h3 className="eyebrow">Районы выезда</h3>
          <ul className="muted mt-4 grid grid-cols-2 gap-1.5 text-sm">
            {DISTRICTS.map((district) => (
              <li key={district}>{district}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Оплата и документы</h3>
          <ul className="muted mt-4 space-y-1.5 text-sm">
            <li>Kaspi QR и перевод</li>
            <li>Банковская карта</li>
            <li>Безналичный расчёт для компаний</li>
            <li>Договор на каждую уборку</li>
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
              Политика конфиденциальности
            </Link>
          </p>
        </div>
      </div>

      <div className="shell muted mt-14 flex flex-col gap-2 border-t border-[var(--hairline)] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {COMPANY.brand}. Тазалық — үйдің тынысы.
        </span>
        <span>
          {COMPANY.city}, {COMPANY.country}
        </span>
      </div>
    </footer>
  );
}
