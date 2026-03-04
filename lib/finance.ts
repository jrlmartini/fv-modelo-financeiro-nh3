export function npv(rate: number, cashflows: number[]): number {
  return cashflows.reduce((acc, cf, idx) => acc + cf / Math.pow(1 + rate, idx), 0);
}

function dNpv(rate: number, cashflows: number[]): number {
  return cashflows.reduce(
    (acc, cf, idx) => (idx === 0 ? acc : acc - (idx * cf) / Math.pow(1 + rate, idx + 1)),
    0
  );
}

export function irr(cashflows: number[], guess = 0.15): number | null {
  const hasPositive = cashflows.some((cf) => cf > 0);
  const hasNegative = cashflows.some((cf) => cf < 0);
  if (!hasPositive || !hasNegative) {
    return null;
  }

  let rate = guess;
  for (let i = 0; i < 50; i += 1) {
    const value = npv(rate, cashflows);
    if (Math.abs(value) < 1e-8) {
      return rate;
    }
    const deriv = dNpv(rate, cashflows);
    if (!Number.isFinite(deriv) || Math.abs(deriv) < 1e-12) {
      break;
    }
    const next = rate - value / deriv;
    if (next <= -0.99 || next > 10 || !Number.isFinite(next)) {
      break;
    }
    if (Math.abs(next - rate) < 1e-10) {
      return next;
    }
    rate = next;
  }

  let low = -0.9;
  let high = 2.0;
  let lowNpv = npv(low, cashflows);
  let highNpv = npv(high, cashflows);

  for (let i = 0; i < 8 && lowNpv * highNpv > 0; i += 1) {
    high += 1.5;
    highNpv = npv(high, cashflows);
  }

  if (lowNpv * highNpv > 0) {
    return null;
  }

  for (let i = 0; i < 200; i += 1) {
    const mid = (low + high) / 2;
    const midNpv = npv(mid, cashflows);
    if (Math.abs(midNpv) < 1e-8 || Math.abs(high - low) < 1e-10) {
      return mid;
    }
    if (lowNpv * midNpv <= 0) {
      high = mid;
      highNpv = midNpv;
    } else {
      low = mid;
      lowNpv = midNpv;
    }
  }

  return (low + high) / 2;
}

export function annuityPayment(principal: number, rate: number, periods: number): number {
  if (periods <= 0) return 0;
  if (rate === 0) return principal / periods;
  const factor = Math.pow(1 + rate, periods);
  return (principal * rate * factor) / (factor - 1);
}
