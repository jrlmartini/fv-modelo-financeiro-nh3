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

## Deploy no GitHub Pages
O projeto está configurado para export estático (`output: "export"`) e deploy automático com GitHub Actions.

1. Em **Settings → Pages**, selecione **Source: GitHub Actions**.
2. Faça push para a branch `main`.
3. O workflow `Deploy Next.js to GitHub Pages` vai:
   - instalar dependências,
   - buildar o site,
   - publicar o conteúdo da pasta `out/`.

A configuração de `basePath` é automática usando o nome do repositório no workflow.

## Estrutura
- `app/` páginas do wizard e resultados
- `components/` componentes de UI e comparação
- `lib/model.ts` motor de cálculo anual
- `lib/finance.ts` IRR/NPV
- `lib/storage.ts` persistência localStorage
- `docs/` PRD e assumptions
- `.github/workflows/deploy-pages.yml` workflow de deploy no Pages
