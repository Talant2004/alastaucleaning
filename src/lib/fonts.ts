import { Playfair, Inter_Tight, JetBrains_Mono } from "next/font/google";

/**
 * Подсет cyrillic-ext обязателен: в нём живут Ә Ғ Қ Ң Ө Ұ Ү Һ І.
 * Без него казахская версия уедет в системный фолбэк.
 *
 * Берём вариативную Playfair, а не Playfair Display: у Display в Google Fonts
 * нет cyrillic-ext, то есть казахские заголовки на ней ломаются.
 */
export const playfair = Playfair({
  subsets: ["cyrillic-ext", "latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const interTight = Inter_Tight({
  subsets: ["cyrillic-ext", "latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const jetbrains = JetBrains_Mono({
  subsets: ["cyrillic-ext", "latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});
