'use client';

import { useEffect, useMemo, useState } from 'react';
import { KPIBar } from '@/components/KPIBar';
import { WizardSlides } from '@/components/WizardSlides';
import { runModel, validateInputs } from '@/lib/model';
import { defaultInputs, type ModelInputs } from '@/lib/types';

const CURRENT_KEY = 'fast-model-current-v1';

export default function HomePage() {
  const [inputs, setInputs] = useState<ModelInputs>(defaultInputs);
  const [step, setStep] = useState(0);

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
    <main className="flex min-h-screen">
      <div className="flex-1 space-y-3">
        <header className="border-b border-slate-800 p-6">
          <h1 className="text-2xl font-bold">Fast Scenario Simulator</h1>
          <p className="text-sm text-slate-400">MVP - project finance simplificado</p>
          {errors.length ? <p className="mt-2 text-sm text-red-300">{errors.join(' | ')}</p> : null}
        </header>
        <WizardSlides inputs={inputs} setInputs={setInputs} step={step} setStep={setStep} />
      </div>
      <KPIBar kpis={output.kpis} />
    </main>
  );
}
