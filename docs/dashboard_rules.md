# Regras para Dashboards Fabris

## **Princípios Fundamentais**

### 1. **Visibilidade e Legibilidade**
- **Tamanho da fonte**: Mínimo 24px para textos, 36px+ para números principais
- **Contraste**: Alto contraste entre texto e fundo (branco sobre escuro ou vice-versa)
- **Distância de leitura**: Todos os elementos devem ser legíveis a 3-5 metros de distância
- **Hierarquia visual**: Informações mais importantes em maior destaque

### 2. **Cores e Indicadores Visuais**
- **Verde**: Produção acima da previsão (sucesso)
- **Amarelo/Laranja**: Produção próxima da previsão (atenção)
- **Vermelho**: Produção abaixo da previsão (alerta)
- **Azul**: Informações neutras e previsões
- **Máximo 4 cores por dashboard** para evitar confusão

### 3. **Layout e Organização**
- **Orientação landscape**: Otimizada para TVs widescreen
- **Grid simples**: Máximo 3 colunas por linha
- **Espaçamento generoso**: Evitar sobrecarga visual
- **Seções claramente definidas**: Cada família/informação em bloco próprio

### 4. **Elementos Visuais**
- **Gráficos de barras**: Preferir sobre gráficos de linha para comparações
- **Ícones grandes e universais**: Setas, símbolos de equipamentos
- **Indicadores de progresso**: Barras de progresso ou medidores circulares
- **Evitar**: Gráficos de pizza, tabelas complexas, textos longos

### 5. **Informações Essenciais**
- **Dados atuais vs previsão**: Sempre visível
- **Percentagem de cumprimento**: Ex: "95% da meta"
- **Tendência**: Pequenos gráficos de evolução mensal (sem escala/números)
- **Período**: Último mês fechado com maior destaque visual
- **Valores monetários**: Sempre em k€ sem casas decimais

### 6. **Atualização e Temporização**
- **Rotação automática**: Se múltiplos dashboards, 30-60 segundos por ecrã
- **Timestamp**: Hora da última atualização sempre visível
- **Refresh**: Dados atualizados pelo menos de hora em hora

### 7. **Adaptação ao Público**
- **Linguagem simples**: Evitar jargão técnico ou financeiro
- **Foco em quantidades**: "150 unidades" em vez de "150 un."
- **Comparações claras**: "Faltam 50 unidades para a meta"
- **Feedback visual imediato**: Status claro à primeira vista

### 9. **Elementos Obrigatórios**
- **Cabeçalho**: Nome da empresa/fábrica
- **Data/Hora**: Sempre visível
- **Legenda**: Explicação das cores
- **Última atualização**: Timestamp claro
- **Destaque do último mês**: Último mês fechado com maior destaque visual

### 8. **Estrutura Recomendada por Dashboard**

#### **Dashboard 1: Produção Mensal por Família**
- Título grande: "PRODUÇÃO MENSAL - [ÚLTIMO MÊS FECHADO]"
- 6 blocos (um por família de equipamento)
- Cada bloco: Nome da família, unidades produzidas, meta, percentagem
- Pequeno gráfico de evolução mensal desde início do ano
- Código de cores para status

#### **Dashboard 2: Previsão Próximos 3 Meses**
- Título: "PREVISÃO PRÓXIMOS 3 MESES"
- Vista por família ou consolidada
- Gráfico de barras simples
- Números grandes e claros

#### **Dashboard 3: Valor Total em €**
- Título: "VALOR TOTAL PRODUÇÃO"
- Valores sempre em k€ sem casas decimais
- Valor atual do mês em destaque
- Gráfico com evolução mensal acumulada vs orçamento anual
- Previsão 3 meses seguintes

### 10. **Testes e Validação**
- **Teste de distância**: Verificar legibilidade a 5 metros
- **Teste de compreensão**: Validar com operários
- **Teste de iluminação**: Verificar visibilidade com diferentes condições de luz
- **Feedback contínuo**: Ajustar baseado no uso real
- **Cabeçalho**: Nome da empresa/fábrica
- **Data/Hora**: Sempre visível
- **Legenda**: Explicação das cores
- **Última atualização**: Timestamp claro

### 11. **Fonte de Dados**
- **Ficheiro Excel**: Todos os dados devem vir de um ficheiro Excel para fácil manutenção
- **Estrutura recomendada**: Folhas separadas para produção, previsões e valores
- **Atualização simples**: Operários podem atualizar dados sem conhecimento técnico
- **Backup automático**: Manter versões anteriores do ficheiro
- **Teste de distância**: Verificar legibilidade a 5 metros
- **Teste de compreensão**: Validar com operários
- **Teste de iluminação**: Verificar visibilidade com diferentes condições de luz
- **Feedback contínuo**: Ajustar baseado no uso real