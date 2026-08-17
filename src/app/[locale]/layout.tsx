import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { EstimateProvider } from "@/components/calculator/estimate-store";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThemeScrollObserver } from "@/components/providers/ThemeScrollObserver";
import { AnalyticsScripts } from "@/components/providers/AnalyticsScripts";
import { LocaleHtml } from "@/components/providers/LocaleHtml";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppFab } from "@/components/contact/WhatsAppFab";
import { MobileStickyBar } from "@/components/contact/MobileStickyBar";
import { CONTACT } from "@/lib/contact";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ru: "/ru",
        kk: "/kz",
        "x-default": "/ru",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "kz" ? "kk_KZ" : "ru_KZ",
      type: "website",
      url: `/${locale}`,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ALAS",
    description:
      locale === "kz"
        ? "Алматыдағы «Аластау» салты бар премиум клининг"
        : "Премиальный клининг с обрядом «Аластау» в Алматы",
    telephone: CONTACT.phoneTel,
    areaServed: "Алматы",
    priceRange: "650–800 ₸/м²",
    openingHours: `Mo-Su ${CONTACT.hoursFrom}:00-${CONTACT.hoursTo}:00`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Алматы",
      addressCountry: "KZ",
    },
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtml />
      <EstimateProvider>
        <AnalyticsScripts />
        <SmoothScroll />
        <ThemeScrollObserver />
        <div className="grain" aria-hidden />
        <SiteHeader />
        <main id="top">{children}</main>
        <SiteFooter />
        <WhatsAppFab />
        <MobileStickyBar />
      </EstimateProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
    </NextIntlClientProvider>
  );
}
