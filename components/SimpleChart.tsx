'use client';

export function SimpleChart({
  values,
  color = '#5fb3ff'
}: {
  values: number[];
  color?: string;
}) {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" className="h-44 w-full rounded border border-slate-700 bg-slate-950 p-2">
      <polyline fill="none" stroke={color} strokeWidth="1.8" points={points} />
    </svg>
  );
}
