export type Currency = 'BRL' | 'USD';
export type MaintCapexMode = 'fixed' | 'percent';
export type AmortizationType = 'PRICE' | 'SAC';

export interface ModelInputs {
  name: string;
  currency: Currency;
  projectLife: number;
  constructionYears: number;
  rampUp: number[];
  capexTotal: number;
  maintCapexMode: MaintCapexMode;
  maintCapexValue: number;
  capacityFull: number;
  price0: number;
  priceGrowth: number;
  opexFixed: number;
  opexVariable: number;
  opexGrowth: number;
  salesTax: number;
  incomeTax: number;
  debtPct: number;
  equityPct: number;
  interestRate: number;
  tenor: number;
  graceYears: number;
  amortization: AmortizationType;
  depreciationLife: number;
  discountRate: number;
}

export interface YearRow {
  year: number;
  isOperation: boolean;
  production: number;
  price: number;
  revenueGross: number;
  salesTax: number;
  revenueNet: number;
  opexFixed: number;
  opexVariable: number;
  opex: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  debtBalanceStart: number;
  interest: number;
  debtService: number;
  principal: number;
  debtBalanceEnd: number;
  incomeTax: number;
  taxableIncome: number;
  capexBuild: number;
  capexMaint: number;
  cfads: number;
  dscr: number | null;
  fcff: number;
  fcfe: number;
}

export interface ModelKpis {
  irrUnlevered: number | null;
  irrEquity: number | null;
  paybackYear: number | null;
  dscrMin: number | null;
  dscrAvg: number | null;
  ebitdaMarginAvg: number | null;
  npvUnlevered: number;
  alertLowDscr: boolean;
}

export interface ModelOutput {
  rows: YearRow[];
  kpis: ModelKpis;
}

export const defaultInputs: ModelInputs = {
  name: 'Cenário Base',
  currency: 'BRL',
  projectLife: 15,
  constructionYears: 2,
  rampUp: [0.6, 0.9, 1],
  capexTotal: 1_000_000_000,
  maintCapexMode: 'fixed',
  maintCapexValue: 12_000_000,
  capacityFull: 1_000_000,
  price0: 500,
  priceGrowth: 0,
  opexFixed: 120_000_000,
  opexVariable: 180,
  opexGrowth: 0,
  salesTax: 0.09,
  incomeTax: 0.34,
  debtPct: 0.7,
  equityPct: 0.3,
  interestRate: 0.12,
  tenor: 8,
  graceYears: 1,
  amortization: 'PRICE',
  depreciationLife: 10,
  discountRate: 0.12
};
