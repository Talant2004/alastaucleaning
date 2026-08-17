"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  calculateEstimate,
  formatTenge,
  getCleaningType,
  isAlastauFree,
  type CleaningTypeId,
  type EstimateState,
  type ExtraId,
  EXTRAS,
} from "@/lib/pricing";
import { track, haptic } from "@/lib/analytics";

const INITIAL: EstimateState = {
  type: "general",
  area: 62,
  balcony: false,
  balconyArea: 6,
  extras: {},
  alastau: true,
};

type EstimateContextValue = {
  state: EstimateState;
  estimate: ReturnType<typeof calculateEstimate>;
  touched: boolean;
  setType: (type: CleaningTypeId) => void;
  setArea: (area: number) => void;
  toggleBalcony: () => void;
  setBalconyArea: (area: number) => void;
  setExtra: (id: ExtraId, qty: number) => void;
  toggleAlastau: () => void;
  whatsappText: () => string;
};

const EstimateContext = createContext<EstimateContextValue | null>(null);

export function EstimateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EstimateState>(INITIAL);
  const [touched, setTouched] = useState(false);

  const markTouched = useCallback(() => {
    setTouched((prev) => {
      if (!prev) track("calc_start");
      return true;
    });
  }, []);

  const setType = useCallback(
    (type: CleaningTypeId) => {
      markTouched();
      haptic();
      setState((prev) => ({ ...prev, type, alastau: prev.alastau || isAlastauFree(type) }));
    },
    [markTouched],
  );

  const setArea = useCallback(
    (area: number) => {
      markTouched();
      setState((prev) => ({ ...prev, area: Math.min(400, Math.max(20, Math.round(area))) }));
    },
    [markTouched],
  );

  const toggleBalcony = useCallback(() => {
    markTouched();
    haptic();
    setState((prev) => ({ ...prev, balcony: !prev.balcony }));
  }, [markTouched]);

  const setBalconyArea = useCallback(
    (area: number) => {
      setState((prev) => ({ ...prev, balconyArea: Math.min(40, Math.max(2, Math.round(area))) }));
    },
    [],
  );

  const setExtra = useCallback(
    (id: ExtraId, qty: number) => {
      markTouched();
      haptic();
      if (qty > 0) track("calc_extras_add", { extra: id, qty });
      setState((prev) => ({ ...prev, extras: { ...prev.extras, [id]: Math.max(0, qty) } }));
    },
    [markTouched],
  );

  const toggleAlastau = useCallback(() => {
    markTouched();
    haptic(12);
    setState((prev) => {
      track("alastau_toggle", { enabled: !prev.alastau });
      return { ...prev, alastau: !prev.alastau };
    });
  }, [markTouched]);

  const estimate = useMemo(() => calculateEstimate(state), [state]);

  const whatsappText = useCallback(() => {
    const type = getCleaningType(state.type);
    const extras = EXTRAS.filter((extra) => (state.extras[extra.id] ?? 0) > 0).map(
      (extra) => `${extra.title} — ${state.extras[extra.id]} ${extra.unit}`,
    );

    return [
      "Здравствуйте! Хочу забронировать уборку по расчёту с сайта:",
      `Тип уборки: ${type.ru}`,
      `Площадь: ${state.area} м²`,
      state.balcony ? `Балкон: да (${state.balconyArea} м²)` : null,
      extras.length ? `Доп. услуги:\n— ${extras.join("\n— ")}` : null,
      state.alastau ? "Обряд «Аластау»: да" : null,
      `Итого по калькулятору: ${formatTenge(estimate.total)}${estimate.hasCustomItems ? " + услуги по договорённости" : ""}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [state, estimate]);

  const value = useMemo(
    () => ({
      state,
      estimate,
      touched,
      setType,
      setArea,
      toggleBalcony,
      setBalconyArea,
      setExtra,
      toggleAlastau,
      whatsappText,
    }),
    [
      state,
      estimate,
      touched,
      setType,
      setArea,
      toggleBalcony,
      setBalconyArea,
      setExtra,
      toggleAlastau,
      whatsappText,
    ],
  );

  return <EstimateContext.Provider value={value}>{children}</EstimateContext.Provider>;
}

export function useEstimate() {
  const ctx = useContext(EstimateContext);
  if (!ctx) throw new Error("useEstimate должен вызываться внутри <EstimateProvider>");
  return ctx;
}
