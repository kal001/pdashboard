# Estrutura de Dados do Dashboard

Este diretório deve conter o ficheiro Excel `dashboard_data.xlsx` com os dados do dashboard.

## Estrutura do Ficheiro Excel

O ficheiro deve ter 3 folhas:

### 1. Folha "production"
Dados de produção mensal por família de equipamento:

| familia | produzido | meta | percentagem | status |
|---------|-----------|------|-------------|--------|
| Equipamentos A | 1250 | 1200 | 104 | success |
| Equipamentos B | 980 | 1000 | 98 | warning |
| Equipamentos C | 850 | 900 | 94 | danger |

### 2. Folha "forecast"
Previsões para os próximos 3 meses:

| mes | previsao | real |
|-----|----------|------|
| Janeiro | 1200 | 1250 |
| Fevereiro | 1100 | 980 |
| Março | 1300 | 1350 |

### 3. Folha "values"
Valores totais em euros:

| mes | valor | orçamento |
|-----|-------|-----------|
| Janeiro | 1250000 | 1200000 |
| Fevereiro | 980000 | 1100000 |
| Março | 1350000 | 1300000 |

## Notas Importantes

- Os valores em euros devem estar em centavos (ex: 1250000 = 12.500€)
- O sistema converte automaticamente para k€ na exibição
- O campo "status" pode ser: success, warning, danger
- Se o ficheiro não existir, o sistema usa dados de exemplo 