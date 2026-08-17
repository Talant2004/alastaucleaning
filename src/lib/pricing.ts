export type CleaningTypeId = "wet" | "general" | "postRepair";

export const CLEANING_TYPES = [
  {
    id: "wet",
    perM2: 650,
    kz: "Ылғалды тазалау",
    ru: "Влажная уборка",
    tagline: "Регулярная поддержка порядка",
    includes: [
      "Пыль со всех открытых поверхностей",
      "Мытьё полов и плинтусов",
      "Санузел: сантехника, зеркала, кафель",
      "Кухня: техника снаружи, мойка, фартук",
    ],
  },
  {
    id: "general",
    perM2: 650,
    kz: "Жалпы тазалау",
    ru: "Генеральная уборка",
    tagline: "Глубокая очистка всей квартиры",
    includes: [
      "Всё из влажной уборки",
      "Стены, кафель, двери и проёмы",
      "Техника снаружи, вытяжные решётки",
      "Окна, подоконники, радиаторы",
      "Обряд «Аластау» в подарок",
    ],
  },
  {
    id: "postRepair",
    perM2: 800,
    kz: "Ремонттан кейін",
    ru: "После ремонта",
    tagline: "Строительная пыль и следы работ",
    includes: [
      "Удаление строительной пыли в два прохода",
      "Следы затирки, краски, цемента, скотча",
      "Мытьё окон и рам после ремонта",
      "Промышленный пылесос и HEPA-фильтрация",
      "Обряд «Аластау» в подарок",
    ],
  },
] as const satisfies readonly {
  id: CleaningTypeId;
  perM2: number;
  kz: string;
  ru: string;
  tagline: string;
  includes: readonly string[];
}[];

export const BALCONY_FLAT_PRICE = 5_000;
/** Площадь, до которой балкон считается стандартным и стоит фиксированно 5 000 ₸. */
export const BALCONY_STANDARD_M2 = 6;

/**
 * Опция «Аластау» при влажной уборке.
 * Цену владелец ещё не зафиксировал — в смете показываем «уточним».
 * При генеральной и после ремонта обряд входит в стоимость (0 ₸).
 */
export const ALASTAU_OPTION_PRICE: number | null = null;

export type ExtraId =
  | "hood"
  | "curtains"
  | "dryCleanKg"
  | "mattress"
  | "sofa"
  | "armchair"
  | "chairs"
  | "cabinets";

export type Extra = {
  id: ExtraId;
  title: string;
  kz?: string;
  price: number | null;
  unit: string;
  from?: boolean;
  max?: number;
};

export const EXTRAS: readonly Extra[] = [
  { id: "hood", title: "Мытьё вытяжки", kz: "Сорғышты жуу", price: 3_000, unit: "шт", max: 3 },
  { id: "curtains", title: "Стирка штор на дому", kz: "Перде үйде", price: 2_000, unit: "пара", max: 10 },
  { id: "dryCleanKg", title: "Химчистка на вес", kz: "Химчистка (кг)", price: 3_000, unit: "кг", max: 30 },
  { id: "mattress", title: "Химчистка матраса", kz: "Матрасты хим тазалау", price: 10_000, unit: "шт", max: 6 },
  { id: "sofa", title: "Химчистка дивана", kz: "Диван хим тазалау", price: 13_000, unit: "шт", max: 4 },
  { id: "armchair", title: "Химчистка кресла", kz: "Кресло", price: 5_000, unit: "шт", from: true, max: 8 },
  { id: "chairs", title: "Химчистка стульев", kz: "Орындықтар", price: 1_000, unit: "шт", from: true, max: 20 },
  {
    id: "cabinets",
    title: "Кухонные шкафы внутри",
    kz: "Кухонный шкафтардың іші",
    price: null,
    unit: "доп. услуга",
  },
];

export const AREA_PRESETS = [
  { label: "Студия", m2: 32 },
  { label: "1-комн.", m2: 45 },
  { label: "2-комн.", m2: 62 },
  { label: "3-комн.", m2: 85 },
  { label: "4-комн.", m2: 110 },
  { label: "Дом", m2: 180 },
] as const;

export type EstimateState = {
  type: CleaningTypeId;
  area: number;
  balcony: boolean;
  balconyArea: number;
  extras: Partial<Record<ExtraId, number>>;
  alastau: boolean;
};

export type EstimateLine = {
  id: string;
  title: string;
  note?: string;
  amount: number | null;
};

export type Estimate = {
  lines: EstimateLine[];
  total: number;
  hasCustomItems: boolean;
  hours: number;
  crew: number;
};

export function getCleaningType(id: CleaningTypeId) {
  return CLEANING_TYPES.find((t) => t.id === id)!;
}

/** Обряд входит в стоимость генеральной уборки и уборки после ремонта. */
export function isAlastauFree(type: CleaningTypeId) {
  return type === "general" || type === "postRepair";
}

export function calculateEstimate(state: EstimateState): Estimate {
  const type = getCleaningType(state.type);
  const lines: EstimateLine[] = [];

  const baseAmount = type.perM2 * state.area;
  lines.push({
    id: "base",
    title: type.ru,
    note: `${state.area} м² × ${type.perM2} ₸`,
    amount: baseAmount,
  });

  if (state.balcony) {
    const oversize = state.balconyArea > BALCONY_STANDARD_M2;
    // Стандарт: всегда пишем м² + фикс 5 000 ₸.
    // Больше среднего: как квартира — площадь × тариф выбранной уборки.
    lines.push({
      id: "balcony",
      title: "Балкон",
      note: oversize
        ? `${state.balconyArea} м² × ${type.perM2} ₸`
        : `${state.balconyArea} м² · стандарт до ${BALCONY_STANDARD_M2} м² — ${BALCONY_FLAT_PRICE.toLocaleString("ru-KZ")} ₸`,
      amount: oversize ? state.balconyArea * type.perM2 : BALCONY_FLAT_PRICE,
    });
  }

  let hasCustomItems = false;

  for (const extra of EXTRAS) {
    const qty = state.extras[extra.id] ?? 0;
    if (qty <= 0) continue;

    if (extra.price === null) {
      hasCustomItems = true;
      lines.push({ id: extra.id, title: extra.title, note: "рассчитаем на объекте", amount: null });
      continue;
    }

    lines.push({
      id: extra.id,
      title: extra.title,
      note: `${qty} ${extra.unit} × ${extra.from ? "от " : ""}${extra.price.toLocaleString("ru-KZ")} ₸`,
      amount: qty * extra.price,
    });
  }

  if (state.alastau) {
    const free = isAlastauFree(state.type);
    if (free) {
      lines.push({
        id: "alastau",
        title: "Обряд «Аластау»",
        note: "в подарок к вашей уборке",
        amount: 0,
      });
    } else if (ALASTAU_OPTION_PRICE === null) {
      hasCustomItems = true;
      lines.push({
        id: "alastau",
        title: "Обряд «Аластау»",
        note: "цену уточним в WhatsApp",
        amount: null,
      });
    } else {
      lines.push({
        id: "alastau",
        title: "Обряд «Аластау»",
        note: "окуривание адыраспаном",
        amount: ALASTAU_OPTION_PRICE,
      });
    }
  }

  const total = lines.reduce((sum, line) => sum + (line.amount ?? 0), 0);

  const extrasCount = Object.values(state.extras).reduce((s, q) => s + (q ?? 0), 0);
  const speedPerHour = state.type === "postRepair" ? 14 : 20;
  const crew = state.area > 120 ? 4 : state.area > 70 ? 3 : 2;
  const rawHours = state.area / speedPerHour / (crew / 2) + extrasCount * 0.25;
  const hours = Math.max(2, Math.round(rawHours * 2) / 2);

  return { lines, total, hasCustomItems, hours, crew };
}

export const formatTenge = (value: number) => `${new Intl.NumberFormat("ru-KZ").format(value)} ₸`;
