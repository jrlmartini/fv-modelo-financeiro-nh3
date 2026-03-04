# PRD Resumido — Fast Scenario Simulator (MVP)

## Objetivo
Permitir simulação rápida de cenários de project finance com poucos inputs e resultados anuais ao vivo.

## Usuário-alvo
Analistas financeiros e time de negócio para triagem de viabilidade.

## Funcionalidades MVP
- Wizard em 6 passos com inputs essenciais (projeto, capex, receita, opex, impostos, capital structure).
- KPI sidebar em tempo real.
- Página de resultados com tabela anual completa e gráficos de séries principais.
- Persistência local de cenários em `localStorage`.
- Comparação de 2 cenários por KPI.
- Export de resultados em CSV e de cenário em JSON.

## Regras de modelo
- Modelo anual simplificado.
- Construção linear, operação com ramp-up editável.
- Dívida no COD, juros fixos, carência com pagamento apenas de juros.
- Impostos efetivos simplificados (sales + income tax).
- Sem capital de giro (ΔWC = 0).

## Não-escopo
- Drawdown mensal, DSRA, indexadores detalhados, covenants.
- Multi-asset portfolio.

## Métricas de sucesso
- Usuário consegue preencher inputs e obter KPIs/fluxos em menos de 3 minutos.
- Export e comparação disponíveis sem backend.
