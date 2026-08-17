# ALAS — Frontend / UI-спека (Next.js)

Технический компаньон к креативной концепции. Здесь: дизайн-токены, дерево компонентов,
motion-варианты, контент-строки и чек-лист съёмки. Логика калькулятора и Firebase — вне этого файла.

---

## 1. Стек

| Слой | Решение |
| --- | --- |
| Framework | Next.js 15 (App Router, RSC по умолчанию, `"use client"` только на анимационных островах) |
| Стили | Tailwind CSS v4 (`@theme` токены) + CSS-переменные для смены темы по скроллу |
| Анимации | `framer-motion` (motion/react), `lenis` для smooth-scroll |
| Медиа | `next/image` (AVIF/WebP), `<video>` c `poster` + `preload="none"` ниже первого экрана |
| Данные | Firebase (тарифы, слоты, кейсы, отзывы) — через server actions |
| i18n | `next-intl`, маршруты `/ru` (default) и `/kz` |

---

## 2. Дизайн-токены

```css
/* app/globals.css */
@theme {
  /* Базы */
  --color-linen:      #F7F4EF; /* тёплый гипс, главный фон светлых секций */
  --color-linen-deep: #EDE7DE; /* вторичный фон, разделители зон */
  --color-obsidian:   #14120F; /* фон ритуальных/финальных секций */
  --color-obsidian-2: #1E1B17; /* карточки на тёмном */

  /* Адыраспан (основной акцент) */
  --color-sage-900: #3E4A3F;
  --color-sage-600: #5E7360;
  --color-sage-400: #8A9A82;
  --color-sage-100: #DCE3D8;

  /* Алас — огонь. Только акценты, максимум 2% площади */
  --color-ember-600: #B4551F;
  --color-ember-500: #C9772F;
  --color-ember-300: #E9A23B;

  /* Вода / воздух — стерильность без «дешёвого синего» */
  --color-glacier-200: #D6E3E0;
  --color-glacier-400: #A8C0BB;

  /* Металл — только hairline 1px, иконки, орнамент */
  --color-brass:  #B99A6B;
  --color-silver: #C9C6BE;

  /* Текст */
  --color-ink:      #14120F;
  --color-ink-60:   #14120F99;
  --color-on-dark:  #F2EDE4;

  /* Радиусы: ровно 3 значения, больше — визуальный шум */
  --radius-card: 24px;
  --radius-media: 32px;
  --radius-pill: 999px;

  /* Тени: одна длинная мягкая, никаких «бордовых» блёкло-серых */
  --shadow-lift: 0 32px 64px -24px rgb(20 18 15 / 0.18);
  --shadow-glass: 0 1px 0 0 rgb(255 255 255 / 0.35) inset;

  /* Типографика */
  --font-display: "Playfair Display", "Times New Roman", serif;
  --font-ui: "Inter Tight", "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Тайминги — единая «дорогая» кривая */
  --ease-brand: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 220ms;
  --dur-base: 520ms;
  --dur-slow: 900ms;
}
```

**Правило пропорций:** 70% linen/obsidian, 20% sage, 8% brass/silver hairlines, 2% ember.
Ember появляется только на: hover primary CTA, активный шаг калькулятора, тумблер «Аластау», иконка огня.

**Инверсия темы по скроллу.** На `<html>` висит `data-theme="day" | "night"`. Переключает
`ThemeScrollObserver` (IntersectionObserver на секциях с `data-theme-zone`), а не JS-скролл-листенер.

```css
:root[data-theme="night"] { --bg: var(--color-obsidian); --fg: var(--color-on-dark); }
:root[data-theme="day"]   { --bg: var(--color-linen);    --fg: var(--color-ink); }
body { background: var(--bg); color: var(--fg); transition: background-color 900ms var(--ease-brand); }
```

**Зерно.** Один глобальный оверлей: `<div class="grain" aria-hidden />`, SVG feTurbulence,
`opacity: .035`, `mix-blend-mode: overlay`, `pointer-events: none`, `position: fixed`.

---

## 3. Шрифты и проверка казахских глиф

Проверено на этапе вёрстки: у `Playfair Display` в Google Fonts **нет** подсета `cyrillic-ext`,
только `cyrillic` — то есть Ә, Ғ, Қ, Ң, Ө, Ү, Һ в заголовках уходят в фолбэк и казахская версия
ломается. Поэтому дисплейный шрифт — вариативная **`Playfair`** (тот же рисунок, есть `cyrillic-ext`
и оси opsz/wght). Проверять любой новый шрифт командой `npm run fonts:check`.

```ts
// src/lib/fonts.ts
import { Playfair, Inter_Tight, JetBrains_Mono } from "next/font/google";

export const display = Playfair({
  subsets: ["cyrillic-ext", "latin"],
  variable: "--font-display", display: "swap",
});
export const ui = Inter_Tight({
  subsets: ["cyrillic-ext", "latin"], variable: "--font-ui", display: "swap",
});
export const mono = JetBrains_Mono({
  subsets: ["cyrillic-ext", "latin"], weight: ["400"], variable: "--font-mono", display: "swap",
});
```

Подсет `cyrillic-ext` обязателен — именно в нём живут `Ә Ғ Қ Ң Ө Ұ Ү Һ І`.
Тест-строка для приёмки шрифта (вставить в Storybook / на `/dev/type`):

```
Аластау — үйдің ауасын жаңғырту. ӘҒҚҢӨҰҮҺІ әғқңөұүһі №650 тг/м²
```

Если хоть одна глифа падает в fallback — шрифт меняем. Платный апгрейд (если бюджет есть):
дисплей `Kudryashev Display Sans/Serif` (type.today), UI `CoFo Sans` — у обоих полноценная казахская кириллица.

Шкала (clamp, без брейкпоинт-лестницы):

```css
--text-h1: clamp(2.75rem, 6.2vw, 6rem);      /* display, 500, line-height .96, tracking -.02em */
--text-h2: clamp(2rem, 4vw, 3.75rem);         /* display, 400 */
--text-h3: clamp(1.375rem, 2vw, 1.875rem);    /* ui, 500 */
--text-body: clamp(1rem, 1.1vw, 1.1875rem);   /* ui, 400, line-height 1.6 */
--text-eyebrow: 0.8125rem;                    /* mono, uppercase, tracking .18em */
```

Цены в калькуляторе — только `font-variant-numeric: tabular-nums`, иначе цифры «прыгают» при тике.

---

## 4. Дерево компонентов

```
app/[locale]/page.tsx                    (RSC, собирает секции, тянет тарифы/слоты из Firebase)
│
├─ <SmoothScrollProvider>                client, Lenis + prefers-reduced-motion bail-out
├─ <GrainOverlay/>                       server
├─ <ThemeScrollObserver/>                client, ставит data-theme на <html>
├─ <SiteHeader/>                          client
│   ├─ <Logo variant="wordmark"/>         SVG, точка-искра ember мигает раз в 6с
│   ├─ <NavLinks/>                        Услуги · Аластау · Цены · Кейсы · Команда · FAQ
│   ├─ <LocaleSwitch/>                    ҚАЗ / РУС
│   ├─ <WhatsAppButton variant="header"/> «WhatsApp · 8 707 306 75 76», иконка + номер
│   └─ <CtaPill href="#calc"/>            «Рассчитать за 30 секунд»
│
├─ <WhatsAppFab/>                          client, fixed bottom-right, desktop/планшет,
│                                          появляется после 60% высоты Hero, см. §11
│
├─ 01 <HeroSection/>                      client (video + parallax)
│   ├─ <HeroVideo/>                       loop 6с, muted, playsInline, poster обязателен
│   ├─ <RevealLines as="h1"/>             clip-path по строкам
│   ├─ <HeroActions/>                     2 равных пути: «Рассчитать» + «Спросить в WhatsApp»
│   ├─ <TrustStrip/>                      4 пункта, mono-микрокапс
│   └─ <SlotsBadge/>                      glass-карточка, данные из Firebase
│
├─ 02 <ObjectionsSection/>                4 × <ObjectionCard flipOnHover/>
├─ 03 <ServicesRail/>                     client, sticky horizontal, <ServiceCard/> ×5
│                                          onAddToCalc(serviceId) → prefill store
├─ 04 <AlastauSection data-theme-zone="night">
│   ├─ <SmokeSequence/>                   client, image-sequence scrub на <canvas>
│   ├─ <EmberCursor/>                     client, radial-mask следует за pointer
│   ├─ <RitualTimeline/>                  3 шага, reveal по scrollYProgress
│   ├─ <RitualFilmModal/>                 40-сек фильм, звук по клику
│   └─ <BotanyDisclosure/>                «Это не магия» — раскрывающийся блок
├─ 05 <CalculatorSection id="calc"/>      client island
│   ├─ <CleaningTypeCards/>               3 крупных переключателя
│   ├─ <AreaControl/>                     slider + input + пресеты квартир
│   ├─ <BalconyControl/>                  фикс 5 000 ₸ / по м² при превышении
│   ├─ <ExtrasToggles/>                   вытяжка, шторы, химчистка, шкафы
│   ├─ <AlastauToggle/>                   ember-подсветка + бейдж «В подарок»
│   ├─ <EstimateReceipt/>                 sticky, <AnimatedNumber/>, tabular-nums
│   │   └─ <WhatsAppButton variant="estimate"/>  отправить смету в WhatsApp одним тапом
│   ├─ <HumanHelpFallback/>               «Не хочу считать сам» → WhatsApp / звонок, см. §11
│   └─ <BookingFlow/>                     дата → слот → форма → success c «бата»-карточкой
│       └─ <PhoneInput mask="+7 (7__) ___-__-__"/>
├─ 06 <BeforeAfterSection/>               <LensCompare/> + фильтры по типу объекта
├─ 07 <TeamSection/>                      <CleanerCard/> с бейджами верификации
├─ 08 <ChecklistSection/>                 аккордеон 148 пунктов + PDF
├─ 09 <ChemistrySection/>                 карточки средств: pH, сертификат, «безопасно для детей»
├─ 10 <SocialProofSection/>
│   ├─ <VideoTestimonialStories/>         9:16 кружки → модалка
│   ├─ <PlatformRating source="2gis"/>     реальный агрегат + логотип
│   └─ <GuaranteeCards/>                  4 гарантии, brass-иконки
├─ 11 <PricingSection/>                   3 «конверта» + список допов
├─ 12 <FaqSection/>                       <details>-семантика + FAQPage JSON-LD
├─ 13 <FinalCtaSection data-theme-zone="night"/>
├─ <SiteFooter/>                           телефон как tel:, WhatsApp, 2GIS, часы работы
└─ <MobileStickyBar/>                     появляется после Hero, 2 кнопки:
                                           [WhatsApp] 40% + [Рассчитать / Итог сметы] 60%
```

---

## 5. Motion-варианты (переиспользуемые)

```ts
// lib/motion.ts
import type { Variants, Transition } from "motion/react";

export const easeBrand = [0.16, 1, 0.3, 1] as const;
export const base: Transition = { duration: 0.52, ease: easeBrand };

/** Построчный reveal. Стагерим СЛОВА/СТРОКИ, не буквы: кириллица по буквам читается плохо. */
export const lineReveal: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: (i: number = 0) => ({
    y: "0%", opacity: 1,
    transition: { ...base, duration: 0.9, delay: 0.06 * i },
  }),
};

export const cardRise: Variants = {
  hidden: { y: 28, opacity: 0, filter: "blur(6px)" },
  show: (i: number = 0) => ({
    y: 0, opacity: 1, filter: "blur(0px)",
    transition: { ...base, delay: 0.08 * i },
  }),
};

/** Орнамент «қошқар мүйіз» — рисуется линией, 1px brass. */
export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.6, ease: "easeInOut" } },
};

export const viewportOnce = { once: true, amount: 0.35 } as const;
```

Обязательный guard на каждом анимационном острове:

```ts
const reduce = useReducedMotion();
const t = reduce ? { duration: 0 } : base;
```

Анимируем только `transform` / `opacity` / `filter`. Никаких `height`, `top`, `box-shadow` в кадре.

---

## 6. Ключевые интерактивы — как реализовать

### 6.1 SmokeSequence (Apple-style scrub)
Снятый на чёрном фоне дым → 90 кадров WebP 1280px (`/smoke/0001.webp`…). Предзагрузка в `useEffect`,
рисуем в `<canvas>` через `useScroll({ target, offset: ["start end", "end start"] })` +
`useTransform(scrollYProgress, [0, 1], [0, 89])`, кадр пишем в `requestAnimationFrame`.
Fallback для мобилы и `reduced-motion`: одно статичное фото + CSS-`mask` градиент.
Текст таймлайна раскрывается тем же прогрессом — «дым проявляет слова».

### 6.2 LensCompare (До/После)
Не сплит-слайдер, а «чистая линза». Два `<Image fill>` в одном контейнере; верхний (ПОСЛЕ) обрезан
`clip-path: circle(var(--r) at var(--x) var(--y))` для desktop-pointer и вертикальным `inset()` на тач.
Нижний (ДО) идёт с `filter: saturate(.7) contrast(.95)` и пыльным overlay. Autoplay-подсказка: при входе
во вьюпорт линза сама проезжает 15% и останавливается. На мобиле — drag-хендл + `navigator.vibrate(8)`.

### 6.3 ServicesRail
`position: sticky` секция высотой `500vh`, внутри `x = useTransform(scrollYProgress, [0,1], ["0%","-72%"])`.
Активная карточка (ближайшая к центру) получает `scale: 1.03`, снимает `blur(4px)` и запускает
свой 3-секундный видеолуп; остальные — приглушены. На мобиле деградирует в нативный
`overflow-x: auto; scroll-snap-type: x mandatory` без pin.

### 6.4 Калькулятор — тактильность
- Тумблер: ripple-«капля» из точки клика + `navigator.vibrate?.(8)`.
- Тумблер «Аластау»: 600 мс ember-градиент прогревает карточку (`animate={{ backgroundPosition }}`).
- Число итога: `useSpring` + `useTransform` → `Intl.NumberFormat("ru-KZ")`, `tabular-nums`.
- Смета удлиняется как чек: новая строка входит `cardRise`, контейнер — `layout` (Framer auto-layout).
- План квартиры (SVG) заливается светом по мере роста м² — `pathLength` на контуре комнат.

---

## 7. Контент-строки (RU) — готовы к вставке в `messages/ru.json`

```json
{
  "hero": {
    "eyebrow": "ПРЕМИАЛЬНЫЙ КЛИНИНГ · АЛМАТЫ",
    "h1": "Мы возвращаем дому не только чистоту. Мы возвращаем ему дыхание.",
    "sub": "Профессиональная уборка по чек-листу из 148 пунктов — и завершающий обряд «Аластау»: окуривание адыраспаном. В подарок к каждой генеральной уборке.",
    "ctaPrimary": "Рассчитать стоимость — 30 секунд",
    "ctaSecondary": "Посмотреть, как проходит Аластау",
    "trust": [
      "От 650 ₸ / м² — цена фиксируется в договоре",
      "Клинеры с паспортом и медсправкой",
      "Материальная ответственность по договору",
      "Эко-состав: безопасно для детей и питомцев"
    ]
  },
  "objections": {
    "h2": "Мы знаем, почему вы годами убираете сами",
    "items": [
      { "fear": "Страшно впускать в дом посторонних", "answer": "До приезда вы получаете карточку клинера: фото, имя, стаж, проверенный паспорт, действующая медсправка." },
      { "fear": "А если испортят мебель или технику?", "answer": "Договор с материальной ответственностью. Любое средство сначала тестируем на скрытом участке." },
      { "fear": "Химия, запах, аллергия", "answer": "pH-нейтральные составы с сертификатами. Паспорта безопасности — по ссылке, до заказа." },
      { "fear": "Сделают быстро и «на отвали»", "answer": "Приёмка по фото до/после. Не устроило — переделываем в течение 48 часов бесплатно." }
    ]
  },
  "alastau": {
    "eyebrow": "ФИРМЕННЫЙ РИТУАЛ ALAS",
    "h2": "Алас, алас — бәледен халас",
    "sub": "Обряд, которым наши бабушки очищали воздух в доме. Мы вернули его — как финальный, 149-й пункт нашего чек-листа.",
    "steps": [
      { "kz": "Тазарту", "ru": "Чистота", "text": "Полная уборка по чек-листу. Пыль, жир, налёт, текстиль — всё, что видно и что не видно." },
      { "kz": "Аластау", "ru": "Дым адыраспана", "text": "Сушёный адыраспан тлеет в керамической чаше. Дым проносят по всем углам, проёмам и порогам — по солнцу, как это делали всегда." },
      { "kz": "Тыныс", "ru": "Дыхание", "text": "Проветривание, гидролат полыни и можжевельника — и карточка с «бата», добрым пожеланием вашему дому." }
    ],
    "botanyTitle": "Это не магия. Это ботаника и уважение к традиции",
    "botanyText": "Адыраспан (гармала) веками использовали как природный антисептик воздуха. Мы проводим обряд аккуратно: 6–8 минут, чаша с песком, открытые окна, датчик дыма прикрыт. Есть версия без дыма — гидролат адыраспана: для аллергиков, детских комнат и офисов.",
    "cta": "Смотреть фильм о ритуале · 40 сек"
  },
  "calculator": {
    "h2": "Соберите свою уборку. Цена — сразу, без звонков",
    "sub": "Никаких «приедем и посмотрим». Итог из калькулятора фиксируется в договоре.",
    "alastauBadge": "В подарок",
    "submit": "Забронировать слот",
    "durationHint": "Ориентировочно {hours} ч, команда из {crew} клинеров"
  },
  "beforeAfter": {
    "h2": "Разница, которую видно без слов",
    "sub": "Реальные объекты в Алматы. Тот же ракурс, тот же свет, без обработки."
  },
  "team": {
    "h2": "Люди, которых вы впускаете в дом",
    "sub": "Каждого клинера мы проверяем сами и показываем вам заранее."
  },
  "socialProof": {
    "h2": "1 300 домов. 92% заказывают снова",
    "guarantees": [
      "Договор на каждую уборку",
      "Материальная ответственность",
      "Бесплатная переделка 48 часов",
      "Цена не меняется после расчёта"
    ]
  },
  "finalCta": {
    "h2": "Ваш дом заслуживает не уборку, а обновление",
    "sub": "Ответим в WhatsApp за 7 минут. Работаем с 08:00 до 21:00.",
    "cta": "Рассчитать и забронировать"
  },
  "contact": {
    "phoneDisplay": "8 707 306 75 76",
    "waHeader": "WhatsApp",
    "waHero": "Спросить в WhatsApp",
    "waFabTooltip": "Не хотите считать? Напишите — назовём цену сами",
    "waEstimate": "Отправить смету в WhatsApp",
    "fallbackTitle": "Не хочется считать самому?",
    "fallbackText": "Напишите нам в WhatsApp или позвоните — задам 3 вопроса и назову точную сумму за пару минут. Считать ничего не нужно.",
    "fallbackWa": "Написать в WhatsApp",
    "fallbackCall": "Позвонить: 8 707 306 75 76",
    "replyTime": "Отвечаем за 7 минут · с 08:00 до 21:00",
    "offHours": "Сейчас нерабочее время. Напишите — ответим утром первым сообщением."
  }
}
```

Казахская версия (`messages/kz.json`) — не машинный перевод. Тексты про обряд на казахском должны
звучать как речь носителя; заголовок Hero: «Үйіңізге тазалық қана емес — тыныс қайтарамыз».

---

## 8. Тарифы — источник истины для UI

```ts
export const RATES = {
  wet:       { id: "wet",       perM2: 650, kz: "Ылғалды тазалау",  ru: "Влажная уборка" },
  general:   { id: "general",   perM2: 650, kz: "Жалпы тазалау",    ru: "Генеральная уборка" },
  postRepair:{ id: "postRepair",perM2: 800, kz: "Ремонттан кейін",  ru: "После ремонта" },
} as const;

export const BALCONY_FLAT = 5_000; // сверх стандартной площади — считаем по perM2 выбранного типа

export const EXTRAS = [
  { id: "hood",        title: "Мытьё вытяжки",              price: 3_000,  unit: "шт" },
  { id: "curtains",    title: "Стирка штор на дому",         price: 2_000,  unit: "пара" },
  { id: "dryCleanKg",  title: "Химчистка на вес",            price: 3_000,  unit: "кг" },
  { id: "mattress",    title: "Химчистка матраса",           price: 10_000, unit: "шт" },
  { id: "sofa",        title: "Химчистка дивана",            price: 13_000, unit: "шт" },
  { id: "armchair",    title: "Химчистка кресла",            price: 5_000,  unit: "шт", from: true },
  { id: "chairs",      title: "Химчистка стульев",           price: 1_000,  unit: "шт", from: true },
  { id: "cabinets",    title: "Кухонные шкафы внутри",       price: null,   unit: "индивидуально" },
] as const;
```

UI-правила: `from: true` рисуем как «от 5 000 ₸», `price: null` — как «Рассчитаем на объекте»
с тултипом-пояснением. «Аластау» показываем как включённую опцию при `general` / `postRepair`
(бейдж «В подарок») и как платную опцию при `wet` — цену подставить из Firebase, не хардкодить.

---

## 9. Чек-лист съёмки (передать владельцу)

**Обязательно отснять**

1. **Свет и воздух (Hero, 4–6 сек луп, 4K, 50 fps):** солнце сквозь чистое окно, тюль дышит от сквозняка, блик на дубовом полу. Съёмка в 2–3 реальных квартирах Алматы, только естественный свет, «золотой час».
2. **Макро-детали, 8–12 дублей:** капля на мраморной столешнице, текстура микрофибры, блик на латунном смесителе, пар от отпаривателя, пучок адыраспана на льняной салфетке, тлеющий уголёк в керамической чаше (120 fps).
3. **Дым на чёрном фоне** — отдельная сессия для секвенции скролла: чёрный бархат, контровой свет, дым из чаши, 90+ кадров подряд. Это самый важный ассет сайта.
4. **Портреты команды:** на светлом фоне linen, форма — песочный/шалфейный лён или фартук, спокойный взгляд, полуоборот. Один свет, мягкий рассеиватель.
5. **Процесс без «постановки»:** руки в кадре, лица не в камеру, ракурсы через отражения и проёмы.
6. **До/После:** штатив зафиксирован маркером на полу, ОДИН и тот же объектив, ручная выдержка/ISO/ББ, одинаковое время суток. Разница должна быть в чистоте, а не в экспозиции.
7. **Вертикальные 9:16 видеоотзывы клиентов** — 20–30 сек, у себя дома, без сценария, звук с петлички.
8. **Фильм о ритуале, 40 сек** — монтаж: чистая комната → чаша → уголь → дым по углам → открытое окно → карточка «бата» на столе.

**Категорически нельзя**

- Стоковые улыбающиеся женщины в резиновых перчатках с ведром и «ОК»-жестом.
- Синие мыльные пузыри, PNG-блёстки, «sparkle»-звёздочки, 3D-роботы и рендеры.
- Любая мистика вокруг обряда: свечи в темноте, амулеты, «шаманская» атрибутика, крупный открытый огонь. Тон — этно-ретрит и забота о воздухе, а не эзотерика.
- Фото чужих объектов из Pinterest, кадры с водяными знаками, чужие интерьеры «для примера».
- Пересвеченный HDR-грейдинг и агрессивная резкость. Грейд: тёплые света, приглушённая насыщенность, лёгкое зерно.
- Текст поверх фото без затемняющего слоя, эмодзи вместо иконок, клипарт.

---

## 10. Приёмка (Definition of Done)

- [ ] LCP < 2.5 c на 4G, CLS < 0.05, INP < 200 мс (Hero-видео с `poster`, шрифты `display: swap`).
- [ ] `prefers-reduced-motion` отключает scrub, параллакс, autoplay-видео.
- [ ] Все интерактивы доступны с клавиатуры; `LensCompare` управляется стрелками, `aria-valuenow`.
- [ ] Казахские глифы `ӘҒҚҢӨҰҮҺІ` рендерятся во всех трёх шрифтах.
- [ ] JSON-LD: `LocalBusiness`, `AggregateRating`, `FAQPage`, `Service` × 3.
- [ ] Цели в GA4 + Яндекс.Метрике: `calc_start`, `calc_extras_add`, `alastau_toggle`, `booking_submit`, `whatsapp_click`.
- [ ] WhatsApp доступен в один тап с любой точки скролла (§11), номер проверен звонком и сообщением.
- [ ] Кнопка WhatsApp не перекрывает липкую смету на мобиле и учитывает `safe-area-inset-bottom`.
- [ ] Телефон в шапке и футере — рабочая `tel:`-ссылка, номер выделяется и копируется.
- [ ] Контраст текста ≥ 4.5:1 на обеих темах (проверить `sage-400` на `linen` — скорее всего не пройдёт, для текста использовать `sage-900`).

---

## 11. Контакт-слой: WhatsApp и звонок (второй путь конверсии)

Калькулятор — не единственная дорога к заказу. Значительная часть аудитории (особенно 40+ и
казахоязычные клиенты) не хочет разбираться в тумблерах: им нужно спросить у живого человека и
услышать сумму. Поэтому WhatsApp — **не виджет в углу, а равноправный CTA**, доступный в один тап
из любой точки страницы.

### 11.1 Константы и генератор ссылок

```ts
// lib/contact.ts
export const CONTACT = {
  phoneDisplay: "8 707 306 75 76",
  phoneTel: "+77073067576",        // href="tel:+77073067576"
  whatsapp: "77073067576",         // wa.me принимает номер без + и без пробелов
  hoursFrom: 8,
  hoursTo: 21,
  replyMinutes: 7,
} as const;

type WaSource =
  | "header" | "hero" | "fab" | "mobile_bar" | "estimate"
  | "calc_fallback" | "faq" | "footer" | "final_cta" | "alastau";

/** Единственный способ собрать ссылку. Прямые wa.me в JSX запрещены — иначе теряем аналитику. */
export function buildWaLink(source: WaSource, text: string) {
  const url = new URL(`https://wa.me/${CONTACT.whatsapp}`);
  url.searchParams.set("text", text);
  return { href: url.toString(), "data-wa-source": source };
}

export function isWorkingHours(d = new Date()) {
  // Алматы = UTC+5, считаем по времени клиента с поправкой на таймзону сайта
  const h = Number(
    new Intl.DateTimeFormat("ru-KZ", { hour: "numeric", hour12: false, timeZone: "Asia/Almaty" })
      .format(d)
  );
  return h >= CONTACT.hoursFrom && h < CONTACT.hoursTo;
}
```

### 11.2 Предзаполненные сообщения по точке входа

Пользователь никогда не должен смотреть в пустое поле ввода — это главная причина, по которой
люди закрывают WhatsApp, не написав. Текст пишем **от лица клиента**, коротко, с уже заданным вопросом.

```ts
export const WA_TEXTS = {
  hero: "Здравствуйте! Хочу уточнить стоимость уборки квартиры.",
  fab: "Здравствуйте! Подскажите цену уборки, считать самому неудобно.",
  calcFallback: "Здравствуйте! Помогите посчитать уборку — не хочу разбираться в калькуляторе.",
  alastau: "Здравствуйте! Интересует уборка с обрядом Аластау. Расскажите подробнее.",
  faq: "Здравствуйте! У меня вопрос по уборке:",
  // Смета собирается из состояния калькулятора — клиент отправляет готовый расчёт
  estimate: (s: { type: string; area: number; extras: string[]; alastau: boolean; total: number }) =>
    [
      "Здравствуйте! Хочу забронировать уборку по расчёту с сайта:",
      `Тип: ${s.type}`,
      `Площадь: ${s.area} м²`,
      s.extras.length ? `Доп. услуги: ${s.extras.join(", ")}` : null,
      s.alastau ? "Обряд Аластау: да" : null,
      `Итого по калькулятору: ${new Intl.NumberFormat("ru-KZ").format(s.total)} ₸`,
    ].filter(Boolean).join("\n"),
} as const;
```

### 11.3 Где стоит кнопка

1. **Шапка (desktop):** пилюля с моно-глифом WhatsApp и номером `8 707 306 75 76`. Номер виден
   всегда — это отдельный сигнал доверия, «нам можно позвонить».
2. **Hero:** вторая кнопка рядом с расчётом, равная по весу визуально, но ghost-стилем:
   «Спросить в WhatsApp». Под ней микрокапсом: «Отвечаем за 7 минут».
3. **`<WhatsAppFab/>` (desktop/планшет):** фиксированный круг 56 px в правом нижнем углу, всплывает
   после 60% высоты Hero. Один раз за сессию (флаг в `sessionStorage`) через 25 секунд без
   взаимодействия с калькулятором рядом появляется подсказка-облачко «Не хотите считать? Напишите —
   назовём цену сами», закрывается крестиком и больше не показывается.
4. **`<MobileStickyBar/>`:** нижний стеклянный бар на всю ширину, две кнопки — WhatsApp (40%) и
   «Рассчитать» / итог сметы (60%). Учитывать `padding-bottom: env(safe-area-inset-bottom)`.
   FAB на мобиле не рендерим, иначе два плавающих элемента конфликтуют.
5. **Внутри сметы:** кнопка «Отправить смету в WhatsApp» — для тех, кто посчитал, но боится формы
   бронирования. Это спасает уже разогретого лида.
6. **`<HumanHelpFallback/>` сразу под калькулятором** — самый важный элемент из всей этой секции.
   Заголовок «Не хочется считать самому?» и текст «Напишите нам в WhatsApp или позвоните — задам
   3 вопроса и назову точную сумму за пару минут. Считать ничего не нужно.» Две кнопки: WhatsApp и
   `tel:`. Ставим именно после калькулятора: человек попробовал, устал — и тут же получает выход,
   вместо того чтобы закрыть сайт.
7. **FAQ, финальный CTA, футер:** WhatsApp + телефон как `tel:` со временем работы.

### 11.4 Визуальные правила

Фирменный зелёный WhatsApp `#25D366` **не используем как заливку** — он выламывается из палитры и
мгновенно превращает премиальный сайт в лендинг с барахолки. Берём:

- **Форму:** обсидиановая пилюля/круг с латунным hairline 1px, глиф WhatsApp монохромный в `linen`.
  Узнаваемость даёт силуэт иконки, а не цвет.
- **Hover:** ember-градиент снизу вверх, как у главной кнопки, + `scale: 1.03`.
- **Живой сигнал:** маленькая точка `--color-ember-300` у края FAB с мягким пульсом 2.4 с
  (`opacity 0.4 → 1`), в нерабочее время — точка `--color-silver` и подпись «ответим утром».
- **Тач-таргет** минимум 56×56 px, `aria-label="Написать в WhatsApp: 8 707 306 75 76"`,
  `rel="noopener"`, `target="_blank"`.
- Никаких автооткрывающихся чат-окон, звуков и анимированных «менеджеров» — это убивает доверие
  ровно так же, как поддельный таймер скидки.

### 11.5 Аналитика

Событие `whatsapp_click` с параметром `source` (значения из `WaSource`) в GA4 и Яндекс.Метрику,
плюс `phone_click` для `tel:`. Через месяц по разбивке `source` станет видно, что реально работает:
если `calc_fallback` и `fab` собирают больше, чем `booking_submit`, — калькулятор надо упрощать,
а не докручивать.

