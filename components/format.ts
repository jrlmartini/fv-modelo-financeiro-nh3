export function formatCurrency(value: number, currency: 'BRL' | 'USD'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPct(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return '-';
  return `${(value * 100).toFixed(1)}%`;
}

export function formatNum(value: number, digits = 0): string {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits }).format(value);
}
