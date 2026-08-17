import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "kz"],
  defaultLocale: "ru",
  localePrefix: "always",
  localeCookie: {
    name: "alas_locale",
    maxAge: 60 * 60 * 24 * 365,
  },
});

export type AppLocale = (typeof routing.locales)[number];
