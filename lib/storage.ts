import type { ModelInputs } from '@/lib/types';

const KEY = 'fast-model-scenarios-v1';

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: string;
  inputs: ModelInputs;
}

export function getScenarios(): SavedScenario[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedScenario[];
  } catch {
    return [];
  }
}

export function saveScenario(inputs: ModelInputs): SavedScenario {
  const next: SavedScenario = {
    id: crypto.randomUUID(),
    name: inputs.name,
    createdAt: new Date().toISOString(),
    inputs
  };
  const list = [next, ...getScenarios()];
  window.localStorage.setItem(KEY, JSON.stringify(list));
  return next;
}

export function upsertScenario(scenario: SavedScenario): void {
  const list = getScenarios();
  const idx = list.findIndex((s) => s.id === scenario.id);
  if (idx >= 0) list[idx] = scenario;
  else list.unshift(scenario);
  window.localStorage.setItem(KEY, JSON.stringify(list));
}
