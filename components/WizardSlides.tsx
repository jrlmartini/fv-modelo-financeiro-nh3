'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { ModelInputs } from '@/lib/types';

interface Props {
  inputs: ModelInputs;
  setInputs: (next: ModelInputs) => void;
}

const sections = [
  { id: 'projeto', label: '1) Projeto' },
  { id: 'capex', label: '2) CAPEX' },
  { id: 'receita', label: '3) Operação / Receita' },
  { id: 'opex', label: '4) OPEX' },
  { id: 'impostos', label: '5) Impostos' },
  { id: 'capital', label: '6) Capital Structure' }
] as const;

function parseMaybeNumber(value: string): number | null {
  const normalized = value.replace(',', '.').trim();
  if (normalized === '') return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function NumberField({
  label,
  value,
  onChange,
  readOnly = false
}: {
  label: string;
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}) {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);

  return (
    <label className="space-y-1 text-xs text-slate-200">
      <span>{label}</span>
      <input
        type="text"
        inputMode="decimal"
        readOnly={readOnly}
        value={text}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          const parsed = parseMaybeNumber(text);
          if (parsed === null) {
            setText('0');
            onChange?.(0);
          }
        }}
        onChange={(e) => {
          const nextText = e.target.value;
          setText(nextText);
          const parsed = parseMaybeNumber(nextText);
          if (parsed !== null) onChange?.(parsed);
        }}
        className="w-full"
      />
    </label>
  );
}

function RampUpField({
  value,
  onChange
}: {
  value: number[];
  onChange: (next: number[]) => void;
}) {
  const [text, setText] = useState(value.join(','));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(value.join(','));
  }, [value, focused]);

  return (
    <label className="space-y-1 text-xs text-slate-200 md:col-span-2">
      <span>Ramp-up (csv, ex: 0.6,0.9,1)</span>
      <input
        value={text}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          if (!text.trim()) {
            setText('0');
            onChange([0]);
          }
        }}
        onChange={(e) => {
          const raw = e.target.value;
          setText(raw);
          const parts = raw
            .split(',')
            .map((x) => parseMaybeNumber(x))
            .filter((x): x is number => x !== null && x >= 0);
          if (parts.length > 0) onChange(parts);
        }}
        className="w-full"
      />
    </label>
  );
}

export function WizardSlides({ inputs, setInputs }: Props) {
  function patch<K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) {
    setInputs({ ...inputs, [key]: value });
  }

  return (
    <section className="space-y-4 p-5 text-sm">
      <nav className="sticky top-0 z-10 rounded-md border border-slate-700 bg-card/95 p-2 backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-300 transition hover:border-accent hover:text-white"
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <Section id="projeto" title="Projeto">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-xs text-slate-200">
            <span>Nome do cenário</span>
            <input value={inputs.name} onChange={(e) => patch('name', e.target.value)} className="w-full" />
          </label>
          <label className="space-y-1 text-xs text-slate-200">
            <span>Moeda</span>
            <select value={inputs.currency} onChange={(e) => patch('currency', e.target.value as 'BRL' | 'USD')} className="w-full">
              <option>BRL</option>
              <option>USD</option>
            </select>
          </label>
          <NumberField label="Vida do projeto (anos)" value={inputs.projectLife} onChange={(v) => patch('projectLife', Math.max(1, Math.round(v)))} />
          <NumberField label="Anos de construção" value={inputs.constructionYears} onChange={(v) => patch('constructionYears', Math.max(1, Math.round(v)))} />
          <RampUpField value={inputs.rampUp} onChange={(v) => patch('rampUp', v)} />
        </div>
      </Section>

      <Section id="capex" title="CAPEX">
        <div className="grid gap-3 md:grid-cols-2">
          <NumberField label="CAPEX total" value={inputs.capexTotal} onChange={(v) => patch('capexTotal', Math.max(0, v))} />
          <NumberField label="Depreciação (anos)" value={inputs.depreciationLife} onChange={(v) => patch('depreciationLife', Math.max(1, Math.round(v)))} />
          <label className="space-y-1 text-xs text-slate-200">
            <span>Modo CAPEX manutenção</span>
            <select value={inputs.maintCapexMode} onChange={(e) => patch('maintCapexMode', e.target.value as 'fixed' | 'percent')} className="w-full">
              <option value="fixed">Valor fixo</option>
              <option value="percent">% do CAPEX</option>
            </select>
          </label>
          <NumberField
            label={inputs.maintCapexMode === 'fixed' ? 'CAPEX manutenção / ano' : '% do CAPEX'}
            value={inputs.maintCapexValue}
            onChange={(v) => patch('maintCapexValue', Math.max(0, v))}
          />
        </div>
      </Section>

      <Section id="receita" title="Operação / Receita">
        <div className="grid gap-3 md:grid-cols-2">
          <NumberField label="Capacidade plena (t/ano)" value={inputs.capacityFull} onChange={(v) => patch('capacityFull', Math.max(0, v))} />
          <NumberField label="Preço por tonelada" value={inputs.price0} onChange={(v) => patch('price0', Math.max(0, v))} />
          <NumberField label="Crescimento preço (decimal)" value={inputs.priceGrowth} onChange={(v) => patch('priceGrowth', v)} />
        </div>
      </Section>

      <Section id="opex" title="OPEX">
        <div className="grid gap-3 md:grid-cols-2">
          <NumberField label="OPEX fixo anual" value={inputs.opexFixed} onChange={(v) => patch('opexFixed', Math.max(0, v))} />
          <NumberField label="OPEX variável por tonelada" value={inputs.opexVariable} onChange={(v) => patch('opexVariable', Math.max(0, v))} />
          <NumberField label="Crescimento OPEX (decimal)" value={inputs.opexGrowth} onChange={(v) => patch('opexGrowth', v)} />
        </div>
      </Section>

      <Section id="impostos" title="Impostos">
        <div className="grid gap-3 md:grid-cols-2">
          <NumberField label="Sales tax efetivo (0-0.8)" value={inputs.salesTax} onChange={(v) => patch('salesTax', Math.max(0, Math.min(0.8, v)))} />
          <NumberField label="Income tax efetivo (0-0.8)" value={inputs.incomeTax} onChange={(v) => patch('incomeTax', Math.max(0, Math.min(0.8, v)))} />
        </div>
      </Section>

      <Section id="capital" title="Capital Structure">
        <div className="grid gap-3 md:grid-cols-2">
          <NumberField
            label="Debt % (0-0.95)"
            value={inputs.debtPct}
            onChange={(v) => {
              const debt = Math.max(0, Math.min(0.95, v));
              patch('debtPct', debt);
              patch('equityPct', Number((1 - debt).toFixed(4)));
            }}
          />
          <NumberField label="Equity %" value={inputs.equityPct} readOnly />
          <NumberField label="Juros efetivos a.a." value={inputs.interestRate} onChange={(v) => patch('interestRate', Math.max(0, v))} />
          <NumberField label="Tenor (anos)" value={inputs.tenor} onChange={(v) => patch('tenor', Math.max(1, Math.round(v)))} />
          <NumberField label="Carência (anos)" value={inputs.graceYears} onChange={(v) => patch('graceYears', Math.max(0, Math.round(v)))} />
          <label className="space-y-1 text-xs text-slate-200">
            <span>Amortização</span>
            <select value={inputs.amortization} onChange={(e) => patch('amortization', e.target.value as 'PRICE' | 'SAC')} className="w-full">
              <option value="PRICE">Anuidade / PRICE</option>
              <option value="SAC">SAC</option>
            </select>
          </label>
        </div>
      </Section>
    </section>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 rounded-lg border border-slate-700 bg-card p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-100">{title}</h2>
      {children}
    </section>
  );
}
