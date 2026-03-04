'use client';

import { useMemo, useState } from 'react';
import { SimpleChart } from '@/components/SimpleChart';
import { ScenarioCompare } from '@/components/ScenarioCompare';
import { formatCurrency, formatNum } from '@/components/format';
import { runModel } from '@/lib/model';
import { getScenarios, saveScenario, type SavedScenario } from '@/lib/storage';
import { defaultInputs, type ModelInputs } from '@/lib/types';

const CURRENT_KEY = 'fast-model-current-v1';

function loadCurrent(): ModelInputs {
  if (typeof window === 'undefined') return defaultInputs;
  const raw = window.localStorage.getItem(CURRENT_KEY);
  return raw ? (JSON.parse(raw) as ModelInputs) : defaultInputs;
}

export default function ResultsPage() {
  const [inputs] = useState<ModelInputs>(loadCurrent);
  const [saved, setSaved] = useState<SavedScenario[]>(() => (typeof window === 'undefined' ? [] : getScenarios()));
  const [compareId, setCompareId] = useState<string>('');

  const output = useMemo(() => runModel(inputs), [inputs]);
  const other = saved.find((s) => s.id === compareId) ?? null;

  const exportCsv = () => {
    const header = Object.keys(output.rows[0]).join(',');
    const lines = output.rows.map((row) => Object.values(row).join(','));
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${inputs.name}-results.csv`;
    a.click();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ inputs, output }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${inputs.name}-scenario.json`;
    a.click();
  };

  const onSave = () => {
    saveScenario(inputs);
    setSaved(getScenarios());
  };

  const onDuplicate = () => {
    const next = { ...inputs, name: `${inputs.name} (cópia)` };
    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(next));
    saveScenario(next);
    setSaved(getScenarios());
  };

  return (
    <main className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">Resultados do cenário</h1>
      <div className="flex flex-wrap gap-2">
        <button className="bg-accent text-slate-900" onClick={onSave}>Salvar cenário</button>
        <button className="border border-slate-700" onClick={onDuplicate}>Duplicar cenário</button>
        <button className="border border-slate-700" onClick={exportCsv}>Export CSV</button>
        <button className="border border-slate-700" onClick={exportJson}>Export JSON</button>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Comparar com...</h2>
        <select value={compareId} onChange={(e) => setCompareId(e.target.value)}>
          <option value="">Selecione</option>
          {saved.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <div className="mt-3"><ScenarioCompare base={{ id: 'current', name: inputs.name, createdAt: '', inputs }} other={other} /></div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div><h3 className="mb-2 font-semibold">EBITDA</h3><SimpleChart values={output.rows.map((r) => r.ebitda)} /></div>
        <div><h3 className="mb-2 font-semibold">CFADS</h3><SimpleChart values={output.rows.map((r) => r.cfads)} color="#34d399" /></div>
        <div><h3 className="mb-2 font-semibold">Debt Balance</h3><SimpleChart values={output.rows.map((r) => r.debtBalanceEnd)} color="#fbbf24" /></div>
        <div><h3 className="mb-2 font-semibold">FCFE Cumulativo</h3><SimpleChart values={output.rows.reduce<number[]>((acc, r, i) => {
          const last = i ? acc[i - 1] : 0;
          acc.push(last + r.fcfe);
          return acc;
        }, [])} color="#f472b6" /></div>
      </section>

      <section className="overflow-auto rounded border border-slate-700">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 bg-slate-900">
            <tr>
              {['Ano', 'Produção', 'Receita Líquida', 'OPEX', 'EBITDA', 'Depreciação', 'Juros', 'Impostos', 'CFADS', 'Debt Service', 'DSCR', 'FCFF', 'FCFE'].map((h) => <th key={h} className="px-2 py-2 text-left">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {output.rows.map((r) => (
              <tr key={r.year} className="border-t border-slate-800">
                <td className="px-2 py-1">{r.year}</td>
                <td className="px-2 py-1">{formatNum(r.production)}</td>
                <td className="px-2 py-1">{formatCurrency(r.revenueNet, inputs.currency)}</td>
                <td className="px-2 py-1">{formatCurrency(r.opex, inputs.currency)}</td>
                <td className="px-2 py-1">{formatCurrency(r.ebitda, inputs.currency)}</td>
                <td className="px-2 py-1">{formatCurrency(r.depreciation, inputs.currency)}</td>
                <td className="px-2 py-1">{formatCurrency(r.interest, inputs.currency)}</td>
                <td className="px-2 py-1">{formatCurrency(r.incomeTax, inputs.currency)}</td>
                <td className="px-2 py-1">{formatCurrency(r.cfads, inputs.currency)}</td>
                <td className="px-2 py-1">{formatCurrency(r.debtService, inputs.currency)}</td>
                <td className="px-2 py-1">{r.dscr?.toFixed(2) ?? '-'}</td>
                <td className="px-2 py-1">{formatCurrency(r.fcff, inputs.currency)}</td>
                <td className="px-2 py-1">{formatCurrency(r.fcfe, inputs.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
