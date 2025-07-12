# API Documentation - PDashboard

## Visão Geral

A API do PDashboard fornece endpoints para gestão de páginas modulares, widgets e configuração do sistema. Todos os endpoints retornam dados em formato JSON.

## Base URL

```
http://localhost:8000
```

## Documentação Interativa

A documentação interativa da API (Swagger UI) está disponível em:

```
http://localhost:8000/api/v1/docs/
```

Você pode explorar e testar todos os endpoints diretamente pelo navegador.

## Auto-Reload dos Clientes

O sistema inclui funcionalidade de auto-reload que atualiza automaticamente todos os dashboards conectados quando há alterações na configuração:

### Como Funciona
- **Detecção Automática**: O dashboard verifica mudanças na configuração a cada 30 segundos
- **Atualização Instantânea**: Quando detecta alterações, recarrega automaticamente a página
- **Sem Intervenção Manual**: Não é necessário refrescar manualmente os browsers dos clientes

### O que Dispara o Auto-Reload
- ✅ **Ativar/Desativar páginas** (via painel admin ou API)
- ✅ **Reordenar páginas** (via drag & drop no admin)
- ✅ **Alterações nos ficheiros config.json**
- ✅ **Qualquer mudança na configuração das páginas**

### Benefícios
- **Sincronização Automática**: Todos os displays mostram sempre a configuração mais recente
- **Zero Downtime**: Atualizações sem interrupção da visualização
- **Multi-Client**: Funciona em múltiplos browsers/displays simultaneamente

## Endpoints

### Dashboard Principal

#### GET /
Retorna a página principal do dashboard com carrossel de páginas modulares.

**Resposta:** HTML da página do dashboard

---

### Gestão de Páginas Modulares

#### GET /api/pages
Retorna a lista de todas as páginas modulares com sua configuração.

**Resposta:**
```json
{
  "pages": [
    {
      "id": "producao3",
      "active": true,
      "type": "3x2",
      "template": "carousel.html",
      "css_file": "producao.css",
      "widgets": [
        { "id": "widget1", "active": true, "name": "Linha 3 - Equipamento A", "sheet": "ModeloA" },
        { "id": "widget2", "active": true, "name": "Linha 3 - Equipamento B", "sheet": "ModeloB" }
      ]
    }
  ]
}
```

O painel de administração consome este endpoint para mostrar, para cada página, o template, css_file e widgets ativos.

#### GET /api/pages/{page_id}
Retorna a configuração de uma página específica.

**Parâmetros:**
- `page_id` (path): ID da página

**Resposta:**
```json
{
  "id": "producao3",
  "active": true,
  "type": "3x2",
  "template": "carousel.html",
  "css_file": "producao.css",
  "widgets": [
    { "id": "widget1", "active": true, "name": "Linha 3 - Equipamento A", "sheet": "ModeloA" },
    { "id": "widget2", "active": true, "name": "Linha 3 - Equipamento B", "sheet": "ModeloB" }
  ]
}
```

#### POST /api/pages/{page_id}/toggle
Ativa ou desativa uma página específica.

**Parâmetros:**
- `page_id` (path): ID da página

**Resposta:**
```json
{
  "success": true,
  "message": "Página ativada/desativada com sucesso",
  "page": {
    "id": "producao3",
    "active": true
  }
}
```

#### POST /api/pages/reorder
Reordena as páginas do dashboard.

**Body:**
```json
{
  "order": [1, 2, 3]
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Páginas reordenadas com sucesso"
}
```

---

### Dados do Dashboard

#### GET /api/data
Retorna todos os dados necessários para o dashboard baseado na configuração das páginas e widgets.

**Resposta:**
```json
{
  "pages": [
    {
      "id": "producao3",
      "widgets": [
        {
          "id": "widget1",
          "name": "Linha 3 - Equipamento A",
          "value": 1250,
          "target": 1200,
          "percent_change": 4.2,
          "trend": "▲",
          "trend_color": "green",
          "labels": ["Jan", "Fev", "Mar"],
          "chart_data": [1000, 1100, 1250],
          "value_color": "#0bda5b"
        },
        {
          "id": "widget2",
          "name": "Linha 3 - Equipamento B",
          "value": 900,
          "target": 950,
          "percent_change": -2.1,
          "trend": "▼",
          "trend_color": "red",
          "labels": ["Jan", "Fev", "Mar"],
          "chart_data": [950, 920, 900],
          "value_color": "#fa6238"
        }
      ]
    }
  ],
  "metadata": {
    "last_update": "2024-07-11T22:57:35Z",
    "company": "Jayme da Costa",
    "version": "1.0.0"
  }
}
```

#### GET /api/data/{page_id}
Retorna os dados de uma página específica.

**Parâmetros:**
- `page_id` (path): ID da página

**Resposta:** Dados dos widgets da página específica (mesma estrutura do array `widgets` acima)

#### GET /api/data/{page_id}/{widget_id}
Retorna os dados de um widget específico.

**Parâmetros:**
- `page_id` (path): ID da página
- `widget_id` (path): ID do widget

**Resposta:**
```json
{
  "id": "widget1",
  "name": "Linha 3 - Equipamento A",
  "value": 1250,
  "target": 1200,
  "percent_change": 4.2,
  "trend": "▲",
  "trend_color": "green",
  "labels": ["Jan", "Fev", "Mar"],
  "chart_data": [1000, 1100, 1250],
  "value_color": "#0bda5b"
}
```

---

### Configuração do Sistema

#### GET /api/config
Retorna a configuração geral do sistema.

**Resposta:**
```json
{
  "carousel_interval": 10000,
  "company_name": "Jayme da Costa",
  "logo_primary": "/static/assets/logo.png",
  "logo_secondary": "/static/assets/getsitelogo.jpeg",
  "theme": {
    "primary_color": "#4CAF50",
    "warning_color": "#FF9800",
    "danger_color": "#F44336",
    "info_color": "#2196F3"
  }
}
```

#### GET /api/health
Verifica o estado de saúde do sistema.

**Resposta:**
```json
{
  "status": "healthy",
  "timestamp": "2024-07-11T22:57:35Z",
  "version": "1.0.0",
  "database": "connected",
  "data_files": "loaded"
}
```

---

## Códigos de Status

- `200 OK`: Requisição bem-sucedida
- `400 Bad Request`: Parâmetros inválidos
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor

## Estrutura de Dados

### Widget Data
```json
{
  "id": "string",
  "name": "string",
  "value": "number",
  "target": "number",
  "percent_change": "number",
  "trend": "▲|▼|→",
  "trend_color": "green|red|gray",
  "labels": ["string"],
  "chart_data": ["number"],
  "value_color": "string"
}
```

### Page Configuration
```json
{
  "id": "string",
  "active": "boolean",
  "type": "3x2",
  "template": "string",
  "css_file": "string",
  "widgets": [ ... ]
}
```

## Exemplos de Uso

### Obter todas as páginas
```bash
curl http://localhost:8000/api/pages
```

### Ativar/desativar uma página
```bash
curl -X POST http://localhost:8000/api/pages/producao3/toggle
```

### Reordenar páginas
```bash
curl -X POST http://localhost:8000/api/pages/reorder -H "Content-Type: application/json" -d '{"order": [1,2,3]}'
```

### Obter dados de uma página específica
```bash
curl http://localhost:8000/api/data/producao3
```

### Obter dados de um widget específico
```bash
curl http://localhost:8000/api/data/producao3/widget1
```

### Verificar saúde do sistema
```bash
curl http://localhost:8000/api/health
```

## Notas de Implementação

- Todos os endpoints são síncronos
- Os dados são lidos do ficheiro Excel em `data/`
- As configurações das páginas são lidas dos ficheiros `config.json` em `pages/`
- O sistema suporta hot-reload de templates em desenvolvimento
- O sistema é extensível para novos tipos de página e widgets no futuro 