'use client';

import { useEffect, useMemo, useState } from 'react';
import { KPIBar } from '@/components/KPIBar';
import { WizardSlides } from '@/components/WizardSlides';
import { runModel, validateInputs } from '@/lib/model';
import { defaultInputs, type ModelInputs } from '@/lib/types';

const CURRENT_KEY = 'fast-model-current-v1';

export default function HomePage() {
  const [inputs, setInputs] = useState<ModelInputs>(defaultInputs);

  useEffect(() => {
    const raw = window.localStorage.getItem(CURRENT_KEY);
    if (raw) setInputs(JSON.parse(raw));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const errors = validateInputs(inputs);
  const output = useMemo(() => runModel(inputs), [inputs]);

  return (
    <main className="flex min-h-screen bg-base">
      <div className="flex-1">
        <header className="border-b border-slate-800 px-5 py-4">
          <h1 className="text-xl font-semibold tracking-tight">Fast Scenario Simulator</h1>
          <p className="text-xs text-slate-400">Página única com seções editáveis e KPIs em tempo real</p>
          {errors.length ? (
            <p className="mt-2 rounded border border-red-500/50 bg-red-950/30 px-2 py-1 text-xs text-red-200">
              {errors.join(' | ')}
            </p>
          ) : null}
        </header>
        <WizardSlides inputs={inputs} setInputs={setInputs} />
      </div>
      <KPIBar kpis={output.kpis} />
    </main>
  );
}
