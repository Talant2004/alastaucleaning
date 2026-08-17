import type { Metadata, Viewport } from "next";
import { interTight, jetbrains, playfair } from "@/lib/fonts";
import { CONTACT } from "@/lib/contact";
import { EstimateProvider } from "@/components/calculator/estimate-store";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThemeScrollObserver } from "@/components/providers/ThemeScrollObserver";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppFab } from "@/components/contact/WhatsAppFab";
import { MobileStickyBar } from "@/components/contact/MobileStickyBar";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ALAS — премиальный клининг в Алматы с обрядом «Аластау»",
  description:
    "Уборка по чек-листу из 148 пунктов и традиционный обряд «Аластау» — окуривание адыраспаном. Цена от 650 ₸/м², фиксируется в договоре. Расчёт на сайте за 30 секунд.",
  keywords: [
    "клининг Алматы",
    "генеральная уборка Алматы",
    "уборка после ремонта",
    "аластау",
    "адыраспан",
    "химчистка мебели Алматы",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ALAS — чистота и обряд «Аластау»",
    description:
      "Премиальный клининг в Алматы: уборка по 148 пунктам и обряд окуривания адыраспаном в подарок.",
    locale: "ru_KZ",
    type: "website",
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#14120f" },
  ],
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ALAS",
  description: "Премиальный клининг с обрядом «Аластау» в Алматы",
  telephone: CONTACT.phoneTel,
  areaServed: "Алматы",
  priceRange: "650–800 ₸/м²",
  openingHours: `Mo-Su ${CONTACT.hoursFrom}:00-${CONTACT.hoursTo}:00`,
  address: { "@type": "PostalAddress", addressLocality: "Алматы", addressCountry: "KZ" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "137" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="day">
      <body
        className={`${playfair.variable} ${interTight.variable} ${jetbrains.variable} antialiased`}
      >
        <EstimateProvider>
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
      </body>
    </html>
  );
}
