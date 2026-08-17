"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");
  const tContact = useTranslations("contact");

  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
      <p className="eyebrow">404</p>
      <h1 className="h1 mt-5 max-w-[18ch]">{t("h1")}</h1>
      <p className="muted mt-6 max-w-[46ch]">{t("sub")}</p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href="/" className="btn btn-primary">
          {t("home")}
        </Link>
        <WhatsAppButton
          source="footer"
          textKey="footer"
          label={tContact("waWrite")}
          variant="brass"
        />
      </div>
    </section>
  );
}
