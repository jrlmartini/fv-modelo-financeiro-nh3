import { annuityPayment, irr, npv } from './finance.ts';
import type { ModelInputs, ModelOutput, YearRow } from './types.ts';

export function validateInputs(inputs: ModelInputs): string[] {
  const errors: string[] = [];
  if (inputs.debtPct < 0 || inputs.debtPct > 0.95) errors.push('DebtPct deve estar entre 0 e 0.95');
  if (inputs.tenor < 1) errors.push('Tenor deve ser >= 1');
  if (inputs.projectLife < inputs.constructionYears + 1) errors.push('N deve ser >= C+1');
  if (inputs.salesTax < 0 || inputs.salesTax > 0.8) errors.push('Sales tax deve estar entre 0 e 0.8');
  if (inputs.incomeTax < 0 || inputs.incomeTax > 0.8) errors.push('Income tax deve estar entre 0 e 0.8');
  return errors;
}

function rampAt(inputs: ModelInputs, year: number): number {
  if (year <= inputs.constructionYears) return 0;
  const opYear = year - inputs.constructionYears - 1;
  return inputs.rampUp[opYear] ?? 1;
}

export function runModel(inputs: ModelInputs): ModelOutput {
  const rows: YearRow[] = [];
  const C = inputs.constructionYears;
  const N = inputs.projectLife;
  const capexPerYear = inputs.capexTotal / C;
  const debt0 = inputs.debtPct * inputs.capexTotal;
  const equity0 = inputs.equityPct * inputs.capexTotal;

  let debtBalance = 0;
  let amortStartBalance = 0;
  let annuity = 0;

  for (let y = 1; y <= N; y += 1) {
    const isOperation = y >= C + 1;
    const k = isOperation ? y - (C + 1) : 0;
    const production = isOperation ? inputs.capacityFull * rampAt(inputs, y) : 0;
    const price = isOperation ? inputs.price0 * Math.pow(1 + inputs.priceGrowth, k) : 0;
    const revenueGross = production * price;
    const salesTax = revenueGross * inputs.salesTax;
    const revenueNet = revenueGross - salesTax;
    const opexFixed = isOperation ? inputs.opexFixed * Math.pow(1 + inputs.opexGrowth, k) : 0;
    const opexVariable = isOperation
      ? production * inputs.opexVariable * Math.pow(1 + inputs.opexGrowth, k)
      : 0;
    const opex = opexFixed + opexVariable;
    const ebitda = revenueNet - opex;
    const depreciation = isOperation ? inputs.capexTotal / inputs.depreciationLife : 0;
    const ebit = ebitda - depreciation;

    if (y === C + 1) {
      debtBalance = debt0;
    }

    const debtBalanceStart = isOperation ? debtBalance : 0;
    const interest = isOperation ? debtBalanceStart * inputs.interestRate : 0;
    let debtService = 0;
    let principal = 0;

    if (isOperation) {
      const opYear = y - C;
      if (opYear <= inputs.graceYears) {
        debtService = interest;
      } else {
        const amortYears = inputs.tenor - inputs.graceYears;
        if (amortYears > 0) {
          if (opYear === inputs.graceYears + 1) {
            amortStartBalance = debtBalanceStart;
            if (inputs.amortization === 'PRICE') {
              annuity = annuityPayment(amortStartBalance, inputs.interestRate, amortYears);
            }
          }
          if (inputs.amortization === 'PRICE') {
            debtService = annuity;
            principal = Math.max(0, debtService - interest);
          } else {
            const principalConst = amortStartBalance / amortYears;
            principal = Math.min(debtBalanceStart, principalConst);
            debtService = interest + principal;
          }
        }
      }
    }

    const debtBalanceEnd = isOperation ? Math.max(0, debtBalanceStart - principal) : 0;
    if (isOperation) {
      debtBalance = debtBalanceEnd;
    }

    const taxableIncome = Math.max(0, ebit - interest);
    const incomeTax = taxableIncome * inputs.incomeTax;
    const capexBuild = y <= C ? capexPerYear : 0;
    const capexMaint = isOperation
      ? inputs.maintCapexMode === 'fixed'
        ? inputs.maintCapexValue
        : inputs.maintCapexValue * inputs.capexTotal
      : 0;

    const cfads = isOperation ? ebitda - incomeTax - capexMaint : 0;
    const dscr = debtService > 0 ? cfads / debtService : null;
    const fcff = isOperation
      ? ebit * (1 - inputs.incomeTax) + depreciation - capexMaint
      : -capexBuild;
    const fcfe = y <= C ? -(equity0 / C) : cfads - debtService;

    rows.push({
      year: y,
      isOperation,
      production,
      price,
      revenueGross,
      salesTax,
      revenueNet,
      opexFixed,
      opexVariable,
      opex,
      ebitda,
      depreciation,
      ebit,
      debtBalanceStart,
      interest,
      debtService,
      principal,
      debtBalanceEnd,
      incomeTax,
      taxableIncome,
      capexBuild,
      capexMaint,
      cfads,
      dscr,
      fcff,
      fcfe
    });
  }

  const fcffSeries = rows.map((r) => r.fcff);
  const fcfeSeries = rows.map((r) => r.fcfe);
  const debtRows = rows.filter((r) => r.debtService > 0);
  const operationRows = rows.filter((r) => r.isOperation && r.revenueNet > 0);

  const irrUnlevered = irr(fcffSeries);
  const irrEquity = irr(fcfeSeries);
  let cumulative = 0;
  let paybackYear: number | null = null;
  for (const row of rows) {
    cumulative += row.fcfe;
    if (paybackYear === null && cumulative >= 0) paybackYear = row.year;
  }

  const dscrValues = debtRows.map((r) => r.dscr ?? 0);
  const dscrMin = dscrValues.length ? Math.min(...dscrValues) : null;
  const dscrAvg = dscrValues.length ? dscrValues.reduce((a, b) => a + b, 0) / dscrValues.length : null;
  const ebitdaMarginAvg = operationRows.length
    ? operationRows.reduce((a, r) => a + r.ebitda / r.revenueNet, 0) / operationRows.length
    : null;

  return {
    rows,
    kpis: {
      irrUnlevered,
      irrEquity,
      paybackYear,
      dscrMin,
      dscrAvg,
      ebitdaMarginAvg,
      npvUnlevered: npv(inputs.discountRate, fcffSeries),
      alertLowDscr: dscrMin !== null && dscrMin < 1
    }
  };
}
