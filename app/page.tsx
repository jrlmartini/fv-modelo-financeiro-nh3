'use client';

import { useEffect, useMemo, useState } from 'react';
import { KPIBar } from '@/components/KPIBar';
import { WizardSlides } from '@/components/WizardSlides';
import { ScenarioCompare } from '@/components/ScenarioCompare';
import { SimpleChart } from '@/components/SimpleChart';
import { formatCurrency, formatNum } from '@/components/format';
import { runModel, validateInputs } from '@/lib/model';
import { getScenarios, saveScenario, type SavedScenario } from '@/lib/storage';
import { defaultInputs, type ModelInputs, type ModelOutput } from '@/lib/types';

const CURRENT_KEY = 'fast-model-current-v1';

export default function HomePage() {
  const [inputs, setInputs] = useState<ModelInputs>(defaultInputs);
  const [result, setResult] = useState<ModelOutput | null>(null);
  const [saved, setSaved] = useState<SavedScenario[]>([]);
  const [compareId, setCompareId] = useState('');
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(CURRENT_KEY);
    if (raw) setInputs(JSON.parse(raw));
    setSaved(getScenarios());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const errors = validateInputs(inputs);
  const liveKpis = useMemo(() => runModel(inputs).kpis, [inputs]);

  const runScenario = () => {
    const next = runModel(inputs);
    setResult(next);
    setIsResultsModalOpen(true);
  };

  const openResultsFromSidebar = () => {
    if (!result) {
      const next = runModel(inputs);
      setResult(next);
    }
    setIsResultsModalOpen(true);
  };

  const exportCsv = () => {
    if (!result || !result.rows.length) return;
    const header = Object.keys(result.rows[0]).join(',');
    const lines = result.rows.map((row) => Object.values(row).join(','));
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${inputs.name}-results.csv`;
    a.click();
  };

  const exportJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify({ inputs, result }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${inputs.name}-scenario.json`;
    a.click();
  };

  const onSave = () => {
    saveScenario(inputs);
    setSaved(getScenarios());
  };

  const other = saved.find((s) => s.id === compareId) ?? null;

  return (
    <>
      <main className="flex min-h-screen bg-base">
        <div className="flex-1">
          <header className="border-b border-slate-800 px-5 py-4">
            <h1 className="text-xl font-semibold tracking-tight">Fast Scenario Simulator</h1>
            <p className="text-xs text-slate-400">Página única: preencha, rode e veja resultados em popup</p>
            {errors.length ? (
              <p className="mt-2 rounded border border-red-500/50 bg-red-950/30 px-2 py-1 text-xs text-red-200">
                {errors.join(' | ')}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-md bg-accent px-3 py-2 text-xs font-semibold text-slate-900" onClick={runScenario}>
                Rodar cenário
              </button>
              <button className="rounded-md border border-slate-700 px-3 py-2 text-xs" onClick={onSave}>Salvar cenário</button>
              <button className="rounded-md border border-slate-700 px-3 py-2 text-xs" onClick={exportCsv} disabled={!result}>Export CSV</button>
              <button className="rounded-md border border-slate-700 px-3 py-2 text-xs" onClick={exportJson} disabled={!result}>Export JSON</button>
            </div>
          </header>

          <WizardSlides inputs={inputs} setInputs={setInputs} />

          <section className="px-5 pb-8">
            <div className="rounded-lg border border-dashed border-slate-700 bg-card p-4 text-xs text-slate-400">
              Clique em <strong>Rodar cenário</strong> ou em <strong>Ver Resultados</strong> na sidebar para abrir o popup.
            </div>
          </section>
        </div>
        <KPIBar kpis={liveKpis} onViewResults={openResultsFromSidebar} />
      </main>

      {isResultsModalOpen && result ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4">
          <div className="max-h-[95vh] w-full max-w-6xl overflow-auto rounded-lg border border-slate-700 bg-base p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Resultados do cenário (última execução)</h2>
              <button className="rounded-md border border-slate-700 px-3 py-1 text-xs" onClick={() => setIsResultsModalOpen(false)}>
                Fechar
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div><h3 className="mb-1 text-xs font-semibold">EBITDA</h3><SimpleChart values={result.rows.map((r) => r.ebitda)} xLabelStart={1} /></div>
              <div><h3 className="mb-1 text-xs font-semibold">CFADS</h3><SimpleChart values={result.rows.map((r) => r.cfads)} color="#34d399" xLabelStart={1} /></div>
              <div><h3 className="mb-1 text-xs font-semibold">Debt Balance</h3><SimpleChart values={result.rows.map((r) => r.debtBalanceEnd)} color="#fbbf24" xLabelStart={1} /></div>
              <div>
                <h3 className="mb-1 text-xs font-semibold">FCFE Cumulativo</h3>
                <SimpleChart values={result.rows.reduce<number[]>((acc, r, i) => {
                  const last = i ? acc[i - 1] : 0;
                  acc.push(last + r.fcfe);
                  return acc;
                }, [])} color="#f472b6" xLabelStart={1} />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-700 bg-card p-4">
              <h2 className="mb-2 text-sm font-semibold">Comparar com cenário salvo</h2>
              <select value={compareId} onChange={(e) => setCompareId(e.target.value)} className="mb-3 w-full max-w-sm">
                <option value="">Selecione</option>
                {saved.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <ScenarioCompare base={{ id: 'current', name: inputs.name, createdAt: '', inputs }} other={other} />
            </div>

            <div className="mt-4 overflow-auto rounded-lg border border-slate-700">
              <table className="min-w-full text-xs">
                <thead className="sticky top-0 bg-slate-900">
                  <tr>
                    {['Ano', 'Produção', 'Receita Líquida', 'OPEX', 'EBITDA', 'Depreciação', 'Juros', 'Impostos', 'CFADS', 'Debt Service', 'DSCR', 'FCFF', 'FCFE'].map((h) => <th key={h} className="px-2 py-2 text-left">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r) => (
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
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
