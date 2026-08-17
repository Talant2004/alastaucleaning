import type { CleaningTypeId, ExtraId } from "@/lib/pricing";
import {
  ALASTAU_OPTION_PRICE,
  BALCONY_FLAT_PRICE,
  BALCONY_STANDARD_M2,
  CLEANING_TYPES,
  EXTRAS,
} from "@/lib/pricing";

/** Переопределения из Firestore `settings/pricing`. */
export type PricingOverrides = {
  wet?: number;
  general?: number;
  postRepair?: number;
  balconyFlat?: number;
  balconyStandardM2?: number;
  alastauOptionPrice?: number | null;
  extras?: Partial<Record<ExtraId, number | null>>;
};

export type ResolvedPricing = {
  perM2: Record<CleaningTypeId, number>;
  balconyFlat: number;
  balconyStandardM2: number;
  alastauOptionPrice: number | null;
  extras: Partial<Record<ExtraId, number | null>>;
};

export function defaultPricing(): ResolvedPricing {
  return {
    perM2: {
      wet: CLEANING_TYPES.find((t) => t.id === "wet")!.perM2,
      general: CLEANING_TYPES.find((t) => t.id === "general")!.perM2,
      postRepair: CLEANING_TYPES.find((t) => t.id === "postRepair")!.perM2,
    },
    balconyFlat: BALCONY_FLAT_PRICE,
    balconyStandardM2: BALCONY_STANDARD_M2,
    alastauOptionPrice: ALASTAU_OPTION_PRICE,
    extras: Object.fromEntries(EXTRAS.map((e) => [e.id, e.price])) as Partial<
      Record<ExtraId, number | null>
    >,
  };
}

export function resolvePricing(overrides?: PricingOverrides | null): ResolvedPricing {
  const base = defaultPricing();
  if (!overrides) return base;

  return {
    perM2: {
      wet: Number.isFinite(overrides.wet) ? Number(overrides.wet) : base.perM2.wet,
      general: Number.isFinite(overrides.general)
        ? Number(overrides.general)
        : base.perM2.general,
      postRepair: Number.isFinite(overrides.postRepair)
        ? Number(overrides.postRepair)
        : base.perM2.postRepair,
    },
    balconyFlat: Number.isFinite(overrides.balconyFlat)
      ? Number(overrides.balconyFlat)
      : base.balconyFlat,
    balconyStandardM2: Number.isFinite(overrides.balconyStandardM2)
      ? Number(overrides.balconyStandardM2)
      : base.balconyStandardM2,
    alastauOptionPrice:
      overrides.alastauOptionPrice === undefined
        ? base.alastauOptionPrice
        : overrides.alastauOptionPrice,
    extras: { ...base.extras, ...overrides.extras },
  };
}

export function parsePricingOverrides(data: unknown): PricingOverrides | null {
  if (!data || typeof data !== "object") return null;
  const raw = data as Record<string, unknown>;
  const extrasRaw = raw.extras;
  const extras: PricingOverrides["extras"] = {};

  if (extrasRaw && typeof extrasRaw === "object") {
    for (const [key, value] of Object.entries(extrasRaw as Record<string, unknown>)) {
      if (value === null) extras[key as ExtraId] = null;
      else if (Number.isFinite(Number(value))) extras[key as ExtraId] = Number(value);
    }
  }

  return {
    wet: Number.isFinite(Number(raw.wet)) ? Number(raw.wet) : undefined,
    general: Number.isFinite(Number(raw.general)) ? Number(raw.general) : undefined,
    postRepair: Number.isFinite(Number(raw.postRepair)) ? Number(raw.postRepair) : undefined,
    balconyFlat: Number.isFinite(Number(raw.balconyFlat)) ? Number(raw.balconyFlat) : undefined,
    balconyStandardM2: Number.isFinite(Number(raw.balconyStandardM2))
      ? Number(raw.balconyStandardM2)
      : undefined,
    alastauOptionPrice:
      raw.alastauOptionPrice === null
        ? null
        : Number.isFinite(Number(raw.alastauOptionPrice))
          ? Number(raw.alastauOptionPrice)
          : undefined,
    extras: Object.keys(extras).length ? extras : undefined,
  };
}
