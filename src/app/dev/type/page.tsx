const KZ_TEST = "Аластау — үйдің ауасын жаңғырту. ӘҒҚҢӨҰҮҺІ әғқңөұүһі №650 тг/м²";
const RU_TEST = "Генеральная уборка и обряд «Аластау» — 650 ₸ за м², цена в договоре.";

const FONTS = [
  { name: "Playfair (display, вариативный)", className: "font-display" },
  { name: "Inter Tight (UI и текст)", className: "font-ui" },
  { name: "JetBrains Mono (микро-лейблы)", className: "font-mono" },
];

const PALETTE = [
  { token: "--color-linen", label: "Linen · тёплый гипс" },
  { token: "--color-linen-deep", label: "Linen deep" },
  { token: "--color-obsidian", label: "Obsidian" },
  { token: "--color-sage-600", label: "Sage 600 · адыраспан" },
  { token: "--color-sage-400", label: "Sage 400" },
  { token: "--color-sage-100", label: "Sage 100" },
  { token: "--color-ember-600", label: "Ember 600" },
  { token: "--color-ember-500", label: "Ember 500 · алас" },
  { token: "--color-ember-300", label: "Ember 300 · искра" },
  { token: "--color-glacier-200", label: "Glacier 200 · вода" },
  { token: "--color-brass", label: "Brass · hairline" },
  { token: "--color-silver", label: "Silver" },
];

/** Страница приёмки: проверяем казахские глифы и палитру до вёрстки секций. */
export default function TypeTestPage() {
  return (
    <div className="shell space-y-16 py-32">
      <header>
        <p className="eyebrow">Стайлгайд · приёмка</p>
        <h1 className="h1 mt-4">Шрифты и палитра</h1>
        <p className="muted mt-4 max-w-[60ch]">
          Если в строке ниже хоть одна казахская буква визуально отличается по рисунку от остальных —
          шрифт не поддерживает cyrillic-ext, и его нужно менять.
        </p>
      </header>

      <section className="space-y-10">
        {FONTS.map((font) => (
          <div key={font.name} className="border-t border-[var(--hairline)] pt-6">
            <p className="eyebrow">{font.name}</p>
            <p className={`${font.className} mt-4 text-3xl leading-tight`}>{KZ_TEST}</p>
            <p className={`${font.className} muted mt-3 text-lg`}>{RU_TEST}</p>
            <p className={`${font.className} nums mt-3 text-2xl`}>
              0123456789 · 650 ₸ · 13 000 ₸ · 4.98★
            </p>
          </div>
        ))}
      </section>

      <section className="border-t border-[var(--hairline)] pt-6">
        <p className="eyebrow">Палитра</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {PALETTE.map((item) => (
            <li key={item.token} className="surface overflow-hidden">
              <div className="h-24 w-full" style={{ background: `var(${item.token})` }} />
              <div className="p-4">
                <p className="text-sm">{item.label}</p>
                <p className="nums muted mt-1 text-xs">{item.token}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--hairline)] pt-6">
        <p className="eyebrow">Кнопки</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary">
            Рассчитать стоимость
          </button>
          <button type="button" className="btn btn-ghost">
            Спросить в WhatsApp
          </button>
          <button type="button" className="btn btn-brass">
            Добавить обряд
          </button>
        </div>
      </section>
    </div>
  );
}
