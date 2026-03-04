import test from 'node:test';
import assert from 'node:assert/strict';
import { runModel } from '../lib/model.ts';
import { defaultInputs } from '../lib/types.ts';

test('Golden scenario KPI snapshot with tolerance', () => {
  const out = runModel(defaultInputs).kpis;
  assert.ok(out.irrUnlevered !== null && Math.abs(out.irrUnlevered - 0.0579) < 0.005);
  assert.equal(out.irrEquity, null);
  assert.ok(out.dscrMin !== null && Math.abs(out.dscrMin - 0.3929) < 0.02);
  assert.equal(out.alertLowDscr, true);
});
