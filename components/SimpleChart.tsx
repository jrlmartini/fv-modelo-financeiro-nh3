'use client';

import { formatNum } from './format';

export function SimpleChart({
  values,
  color = '#5fb3ff',
  xLabelStart = 1
}: {
  values: number[];
  color?: string;
  xLabelStart?: number;
}) {
  if (!values.length) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = 8 + (i / Math.max(values.length - 1, 1)) * 84;
      const y = 12 + (1 - (v - min) / range) * 70;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded border border-slate-700 bg-slate-950 p-2">
      <svg viewBox="0 0 100 90" className="h-44 w-full">
        <line x1="8" y1="12" x2="8" y2="82" stroke="#334155" strokeWidth="0.5" />
        <line x1="8" y1="82" x2="92" y2="82" stroke="#334155" strokeWidth="0.5" />
        <line x1="8" y1="47" x2="92" y2="47" stroke="#1e293b" strokeWidth="0.4" strokeDasharray="1.5 1" />
        <polyline fill="none" stroke={color} strokeWidth="1.8" points={points} />
      </svg>
      <div className="mt-1 grid grid-cols-2 text-[10px] text-slate-400">
        <span>Ano {xLabelStart}</span>
        <span className="text-right">Ano {xLabelStart + values.length - 1}</span>
      </div>
      <div className="mt-1 grid grid-cols-2 text-[10px] text-slate-400">
        <span>Min: {formatNum(min, 0)}</span>
        <span className="text-right">Max: {formatNum(max, 0)}</span>
      </div>
    </div>
  );
}
