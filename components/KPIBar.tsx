'use client';

import type { ModelKpis } from '@/lib/types';
import { formatPct } from './format';

export function KPIBar({ kpis }: { kpis: ModelKpis }) {
  const cards = [
    ['Project IRR', formatPct(kpis.irrUnlevered)],
    ['Equity IRR', formatPct(kpis.irrEquity)],
    ['Payback', kpis.paybackYear ? `${kpis.paybackYear}` : '-'],
    ['DSCR Min', kpis.dscrMin?.toFixed(2) ?? '-'],
    ['DSCR Avg', kpis.dscrAvg?.toFixed(2) ?? '-'],
    ['Margem EBITDA', formatPct(kpis.ebitdaMarginAvg)]
  ];

  return (
    <aside className="sticky top-0 h-screen w-full max-w-sm space-y-3 border-l border-slate-800 bg-slate-950/80 p-4">
      <h3 className="text-lg font-semibold">KPIs ao vivo</h3>
      {kpis.alertLowDscr ? (
        <p className="rounded bg-amber-900/30 p-2 text-xs text-amber-200">Alerta: DSCR mínimo abaixo de 1.0</p>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded border border-slate-700 bg-card p-3">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <a href="/results" className="block rounded bg-accent text-center font-semibold text-slate-900">
        Ver Resultados
      </a>
    </aside>
  );
}
