'use client';

import { runModel } from '@/lib/model';
import type { SavedScenario } from '@/lib/storage';
import { formatPct } from './format';

export function ScenarioCompare({ base, other }: { base: SavedScenario; other: SavedScenario | null }) {
  if (!other) {
    return <p className="text-sm text-slate-400">Selecione um cenário para comparar.</p>;
  }
  const a = runModel(base.inputs).kpis;
  const b = runModel(other.inputs).kpis;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <CompareItem label="Project IRR" left={formatPct(a.irrUnlevered)} right={formatPct(b.irrUnlevered)} />
      <CompareItem label="Equity IRR" left={formatPct(a.irrEquity)} right={formatPct(b.irrEquity)} />
      <CompareItem label="DSCR Min" left={a.dscrMin?.toFixed(2) ?? '-'} right={b.dscrMin?.toFixed(2) ?? '-'} />
    </div>
  );
}

function CompareItem({ label, left, right }: { label: string; left: string; right: string }) {
  return (
    <div className="rounded border border-slate-700 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm">Atual: {left}</p>
      <p className="text-sm">Comparado: {right}</p>
    </div>
  );
}
