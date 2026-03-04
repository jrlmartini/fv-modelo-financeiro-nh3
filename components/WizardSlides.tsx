'use client';

import { useMemo } from 'react';
import type { ModelInputs } from '@/lib/types';

interface Props {
  inputs: ModelInputs;
  setInputs: (next: ModelInputs) => void;
  step: number;
  setStep: (n: number) => void;
}

const total = 6;

export function WizardSlides({ inputs, setInputs, step, setStep }: Props) {
  const progress = useMemo(() => ((step + 1) / total) * 100, [step]);

  function patch<K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) {
    setInputs({ ...inputs, [key]: value });
  }

  return (
    <section className="space-y-5 p-6">
      <div>
        <p className="text-sm text-slate-400">Passo {step + 1} de {total}</p>
        <div className="mt-2 h-2 w-full rounded bg-slate-800">
          <div className="h-2 rounded bg-accent" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {step === 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          <label>Nome do cenário<input value={inputs.name} onChange={(e) => patch('name', e.target.value)} /></label>
          <label>Moeda<select value={inputs.currency} onChange={(e) => patch('currency', e.target.value as 'BRL' | 'USD')}><option>BRL</option><option>USD</option></select></label>
          <label>Vida do projeto<input type="number" value={inputs.projectLife} onChange={(e) => patch('projectLife', Number(e.target.value))} /></label>
          <label>Anos de construção<input type="number" value={inputs.constructionYears} onChange={(e) => patch('constructionYears', Number(e.target.value))} /></label>
          <label className="md:col-span-2">Ramp-up (csv ex: 0.6,0.9,1)
            <input value={inputs.rampUp.join(',')} onChange={(e) => patch('rampUp', e.target.value.split(',').map(Number).filter((x) => !Number.isNaN(x)))} />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-3 md:grid-cols-2">
          <label>CAPEX total<input type="number" value={inputs.capexTotal} onChange={(e) => patch('capexTotal', Number(e.target.value))} /></label>
          <label>Depreciação (anos)<input type="number" value={inputs.depreciationLife} onChange={(e) => patch('depreciationLife', Number(e.target.value))} /></label>
          <label>Modo CAPEX manutenção<select value={inputs.maintCapexMode} onChange={(e) => patch('maintCapexMode', e.target.value as 'fixed' | 'percent')}><option value="fixed">Valor fixo</option><option value="percent">% do CAPEX</option></select></label>
          <label>{inputs.maintCapexMode === 'fixed' ? 'CAPEX manutenção / ano' : '% do CAPEX'}<input type="number" value={inputs.maintCapexValue} onChange={(e) => patch('maintCapexValue', Number(e.target.value))} /></label>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-3 md:grid-cols-2">
          <label>Capacidade plena (t/ano)<input type="number" value={inputs.capacityFull} onChange={(e) => patch('capacityFull', Number(e.target.value))} /></label>
          <label>Preço por tonelada<input type="number" value={inputs.price0} onChange={(e) => patch('price0', Number(e.target.value))} /></label>
          <label>Crescimento preço (decimal)<input type="number" step="0.01" value={inputs.priceGrowth} onChange={(e) => patch('priceGrowth', Number(e.target.value))} /></label>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-3 md:grid-cols-2">
          <label>OPEX fixo anual<input type="number" value={inputs.opexFixed} onChange={(e) => patch('opexFixed', Number(e.target.value))} /></label>
          <label>OPEX variável por tonelada<input type="number" value={inputs.opexVariable} onChange={(e) => patch('opexVariable', Number(e.target.value))} /></label>
          <label>Crescimento OPEX (decimal)<input type="number" step="0.01" value={inputs.opexGrowth} onChange={(e) => patch('opexGrowth', Number(e.target.value))} /></label>
        </div>
      )}

      {step === 4 && (
        <div className="grid gap-3 md:grid-cols-2">
          <label>Sales tax efetivo (0-0.8)<input type="number" step="0.01" value={inputs.salesTax} onChange={(e) => patch('salesTax', Number(e.target.value))} /></label>
          <label>Income tax efetivo (0-0.8)<input type="number" step="0.01" value={inputs.incomeTax} onChange={(e) => patch('incomeTax', Number(e.target.value))} /></label>
        </div>
      )}

      {step === 5 && (
        <div className="grid gap-3 md:grid-cols-2">
          <label>Debt % (0-0.95)<input type="number" step="0.01" value={inputs.debtPct} onChange={(e) => {
            const debt = Number(e.target.value);
            patch('debtPct', debt);
            patch('equityPct', 1 - debt);
          }} /></label>
          <label>Equity %<input type="number" step="0.01" value={inputs.equityPct} readOnly /></label>
          <label>Juros efetivos a.a.<input type="number" step="0.01" value={inputs.interestRate} onChange={(e) => patch('interestRate', Number(e.target.value))} /></label>
          <label>Tenor (anos)<input type="number" value={inputs.tenor} onChange={(e) => patch('tenor', Number(e.target.value))} /></label>
          <label>Carência (anos)<input type="number" value={inputs.graceYears} onChange={(e) => patch('graceYears', Number(e.target.value))} /></label>
          <label>Amortização<select value={inputs.amortization} onChange={(e) => patch('amortization', e.target.value as 'PRICE' | 'SAC')}><option value="PRICE">Anuidade / PRICE</option><option value="SAC">SAC</option></select></label>
        </div>
      )}

      <div className="flex justify-between">
        <button className="border border-slate-700" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>Back</button>
        <button className="bg-accent text-slate-900" disabled={step === total - 1} onClick={() => setStep(Math.min(total - 1, step + 1))}>Next</button>
      </div>
    </section>
  );
}
