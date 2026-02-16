export const clampNumber = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export type LinearLoaSimulationInput = {
  price: number;
  durationMonths: number;
  depositPercent: number;
  residualPercent: number;
  maxResidualPercent?: number;
};

export type LinearLoaSimulationResult = {
  monthly: number;
  depositAmount: number;
  residual: number;
  financed: number;
};

export const simulateLinearLoa = ({
  price,
  durationMonths,
  depositPercent,
  residualPercent,
  maxResidualPercent = 60,
}: LinearLoaSimulationInput): LinearLoaSimulationResult => {
  const capital = Math.max(0, price);
  const deposit = clampNumber(depositPercent, 0, 100);
  const depositAmount = (deposit / 100) * capital;
  const financedAmount = Math.max(0, capital - depositAmount);
  const residual = (clampNumber(residualPercent, 0, maxResidualPercent) / 100) * financedAmount;
  const financed = Math.max(0, financedAmount - residual);

  if (!financed || durationMonths <= 0) {
    return {
      monthly: 0,
      depositAmount: Math.round(depositAmount),
      residual: Math.round(residual),
      financed: Math.round(financed),
    };
  }

  return {
    monthly: Math.round(financed / durationMonths),
    depositAmount: Math.round(depositAmount),
    residual: Math.round(residual),
    financed: Math.round(financed),
  };
};

type EstimateVehicleMonthlyInput = {
  price?: number | string | null;
  fallbackMonthly?: number | null;
  durationMonths: number;
  firstPayment?: number | null;
  minMonthly?: number;
};

const normalizePrice = (value?: number | string | null): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const numeric = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

export const estimateVehicleMonthly = ({
  price,
  fallbackMonthly = null,
  durationMonths,
  firstPayment = null,
  minMonthly = 99,
}: EstimateVehicleMonthlyInput): number | null => {
  const priceNumber = normalizePrice(price);

  const baseFromPrice =
    priceNumber && priceNumber > 0 ? Math.max(minMonthly, priceNumber / Math.max(12, durationMonths)) : null;
  const baseMonthly = baseFromPrice ?? fallbackMonthly;

  if (baseMonthly === null || !Number.isFinite(baseMonthly)) return null;

  const upfrontImpact = firstPayment && firstPayment > 0 ? -firstPayment / Math.max(6, durationMonths) : 0;
  const estimated = baseMonthly + upfrontImpact;

  if (!Number.isFinite(estimated) || estimated <= 0) return null;

  return Math.max(minMonthly, Math.round(estimated));
};
