import type { CleaningTypeId, EstimateState } from "@/lib/pricing";

export type BookingStatus = "new" | "confirmed" | "done" | "cancelled";

export type BookingInput = {
  date: string;
  time: string;
  name?: string;
  phone?: string;
  address?: string;
  message: string;
  locale?: string;
  estimate: {
    type: CleaningTypeId;
    area: number;
    balcony: boolean;
    balconyArea: number;
    extras: EstimateState["extras"];
    alastau: boolean;
    total: number;
    hasCustomItems: boolean;
  };
};

export type BookingRecord = BookingInput & {
  status: BookingStatus;
  createdAt: unknown;
  source: "site";
};

export function sanitizeBooking(body: unknown): BookingInput | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const date = typeof data.date === "string" ? data.date.trim() : "";
  const time = typeof data.time === "string" ? data.time.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !time || !message) return null;

  const estimateRaw = data.estimate;
  if (!estimateRaw || typeof estimateRaw !== "object") return null;
  const estimate = estimateRaw as Record<string, unknown>;

  const type = estimate.type;
  if (type !== "wet" && type !== "general" && type !== "postRepair") return null;

  const area = Number(estimate.area);
  const total = Number(estimate.total);
  if (!Number.isFinite(area) || !Number.isFinite(total)) return null;

  const extras =
    estimate.extras && typeof estimate.extras === "object"
      ? (estimate.extras as EstimateState["extras"])
      : {};

  return {
    date,
    time,
    name: typeof data.name === "string" ? data.name.trim().slice(0, 80) : "",
    phone: typeof data.phone === "string" ? data.phone.trim().slice(0, 40) : "",
    address: typeof data.address === "string" ? data.address.trim().slice(0, 200) : "",
    message: message.slice(0, 4000),
    locale: typeof data.locale === "string" ? data.locale.slice(0, 8) : undefined,
    estimate: {
      type,
      area: Math.min(400, Math.max(1, Math.round(area))),
      balcony: Boolean(estimate.balcony),
      balconyArea: Number.isFinite(Number(estimate.balconyArea))
        ? Math.min(40, Math.max(0, Math.round(Number(estimate.balconyArea))))
        : 0,
      extras,
      alastau: Boolean(estimate.alastau),
      total: Math.max(0, Math.round(total)),
      hasCustomItems: Boolean(estimate.hasCustomItems),
    },
  };
}
