import test from 'node:test';
import assert from 'node:assert/strict';
import { irr, npv } from '../lib/finance.ts';

test('NPV simple case', () => {
  const value = npv(0.1, [-100, 60, 60]);
  assert.ok(Math.abs(value - 4.132) < 0.01);
});

test('IRR known case', () => {
  const value = irr([-100, 60, 60]);
  assert.ok(value !== null);
  assert.ok(Math.abs((value as number) - 0.13066) < 1e-3);
});

test('IRR with no sign change returns null', () => {
  assert.equal(irr([1, 2, 3]), null);
});
