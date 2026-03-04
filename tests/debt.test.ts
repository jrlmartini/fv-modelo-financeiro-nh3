import test from 'node:test';
import assert from 'node:assert/strict';
import { runModel } from '../lib/model.ts';
import { defaultInputs } from '../lib/types.ts';

test('Debt schedule reaches near zero by tenor end', () => {
  const output = runModel({ ...defaultInputs, amortization: 'PRICE', graceYears: 0, tenor: 8, projectLife: 12 });
  const debtRows = output.rows.filter((r) => r.debtService > 0);
  const lastDebt = debtRows[debtRows.length - 1]?.debtBalanceEnd ?? 0;
  assert.ok(lastDebt < 1e-3);
});
