import fs from "node:fs";

/**
 * Проверка, у каких шрифтов next/font есть подсет cyrillic-ext.
 * Без него казахские Ә Ғ Қ Ң Ө Ү Һ уходят в системный фолбэк.
 */
const types = fs.readFileSync(
  "node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts",
  "utf8",
);

const candidates = [
  "Lora",
  "Cormorant_Garamond",
  "Cormorant",
  "PT_Serif",
  "Merriweather",
  "Prata",
  "Playfair",
  "Playfair_Display",
  "Alegreya",
  "Literata",
  "EB_Garamond",
  "Source_Serif_4",
  "Spectral",
  "Onest",
  "Golos_Text",
  "Manrope",
  "Inter_Tight",
  "JetBrains_Mono",
];

for (const name of candidates) {
  const start = types.indexOf(`declare function ${name}<`);
  if (start < 0) {
    console.log(`${name.padEnd(20)} — нет в next/font`);
    continue;
  }

  const nextFn = types.indexOf("declare function ", start + 10);
  const block = types.slice(start, nextFn > 0 ? nextFn : undefined);
  const match = block.match(/subsets\?:\s*Array<([^>]+)>/);

  if (!match) {
    console.log(`${name.padEnd(20)} — не нашёл список подсетов`);
    continue;
  }

  const subsets = match[1]
    .split("|")
    .map((s) => s.trim().replace(/['"]/g, ""))
    .filter(Boolean);

  const ok = subsets.includes("cyrillic-ext");
  console.log(`${name.padEnd(20)} ${ok ? "✔ cyrillic-ext" : "✘ только: " + subsets.join(", ")}`);
}
