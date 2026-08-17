import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const YM_ID = process.env.NEXT_PUBLIC_YM_ID;

/**
 * GA4 и Яндекс.Метрика. Если ID нет в env — ничего не рендерим (локально не мусорим).
 * Вебвизор и карта кликов включаются в init Метрики; цели reachGoal — через track().
 */
export function AnalyticsScripts() {
  const ymIdNum = YM_ID ? Number(YM_ID) : NaN;
  const hasYm = Number.isFinite(ymIdNum) && ymIdNum > 0;
  const hasGa = Boolean(GA_ID);

  if (!hasGa && !hasYm) return null;

  return (
    <>
      {hasGa && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: true });
            `}
          </Script>
        </>
      )}

      {hasYm && (
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(${ymIdNum}, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true,
              ecommerce: "dataLayer"
            });
          `}
        </Script>
      )}

      {hasYm && (
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc.yandex.ru/watch/${ymIdNum}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      )}
    </>
  );
}
