# Fast Scenario Simulator (MVP)

Aplicação Next.js + TypeScript para simulação rápida de cenários de project finance simplificado.

## Rodar localmente
```bash
npm install
npm run dev
```

## Testes
```bash
npm test
```

## Estrutura
- `app/` páginas do wizard e resultados
- `components/` componentes de UI e comparação
- `lib/model.ts` motor de cálculo anual
- `lib/finance.ts` IRR/NPV
- `lib/storage.ts` persistência localStorage
- `docs/` PRD e assumptions
