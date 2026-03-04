'use client';

import type { ModelKpis } from '@/lib/types';
import { formatPct } from './format';

export function KPIBar({
  kpis,
  onViewResults
}: {
  kpis: ModelKpis;
  onViewResults: () => void;
}) {
  const cards = [
    ['Project IRR', formatPct(kpis.irrUnlevered)],
    ['Equity IRR', formatPct(kpis.irrEquity)],
    ['Payback', kpis.paybackYear ? `${kpis.paybackYear}` : '-'],
    ['DSCR Min', kpis.dscrMin?.toFixed(2) ?? '-'],
    ['DSCR Avg', kpis.dscrAvg?.toFixed(2) ?? '-'],
    ['Margem EBITDA', formatPct(kpis.ebitdaMarginAvg)]
  ];

  return (
    <aside className="sticky top-0 h-screen w-full max-w-xs space-y-2 border-l border-slate-800 bg-slate-950/85 p-3 text-xs">
      <h3 className="text-sm font-semibold">KPIs ao vivo</h3>
      {kpis.alertLowDscr ? (
        <p className="rounded border border-amber-700/40 bg-amber-900/20 p-2 text-[11px] text-amber-200">
          Alerta: DSCR mínimo abaixo de 1.0
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-md border border-slate-700 bg-card p-2">
            <p className="text-[10px] text-slate-400">{label}</p>
            <p className="text-xs font-semibold text-slate-100">{value}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onViewResults}
        className="block w-full rounded-md bg-accent py-2 text-center text-xs font-semibold text-slate-900"
      >
        Ver Resultados
      </button>
    </aside>
  );
}
