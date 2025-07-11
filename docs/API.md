# API Documentation - PDashboard

## Visão Geral

A API do PDashboard fornece endpoints para gestão de páginas modulares, dados e configuração do sistema. Todos os endpoints retornam dados em formato JSON.

## Base URL

```
http://localhost:8000
```

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
        { "id": "widget1", "active": true, "name": "Linha 3 - Equipamento A" },
        { "id": "widget2", "active": true, "name": "Linha 3 - Equipamento B" }
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
  "id": "producao",
  "active": true,
  "type": "carousel",
  "duration": 10,
  "template": "carousel.html",
  "css_file": "producao.css",
  "widgets": [
    {
      "id": "widget1",
      "title": "Produção Total",
      "type": "metric",
      "data_source": "producao.xlsx",
      "sheet": "Total",
      "value_column": "B",
      "target_column": "C"
    }
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
    "id": "producao",
    "active": true
  }
}
```

---

### Dados do Dashboard

#### GET /api/data
Retorna todos os dados necessários para o dashboard baseado na configuração das páginas.

**Resposta:**
```json
{
  "pages": [
    {
      "id": "producao",
      "widgets": [
        {
          "id": "widget1",
          "title": "Produção Total",
          "value": 1250,
          "target": 1200,
          "percentage": 104,
          "status": "success",
          "color": "green"
        },
        {
          "id": "widget2",
          "title": "Família A",
          "value": 450,
          "target": 500,
          "percentage": 90,
          "status": "warning",
          "color": "yellow"
        },
        {
          "id": "widget3",
          "title": "Família B",
          "value": 800,
          "target": 700,
          "percentage": 114,
          "status": "success",
          "color": "green"
        },
        {
          "id": "widget4",
          "title": "Família C",
          "value": 300,
          "target": 400,
          "percentage": 75,
          "status": "danger",
          "color": "red"
        },
        {
          "id": "widget5",
          "title": "Família D",
          "value": 600,
          "target": 550,
          "percentage": 109,
          "status": "success",
          "color": "green"
        },
        {
          "id": "widget6",
          "title": "Família E",
          "value": 350,
          "target": 400,
          "percentage": 88,
          "status": "warning",
          "color": "yellow"
        }
      ]
    }
  ],
  "metadata": {
    "last_update": "2024-01-15T14:30:00Z",
    "company": "Jayme da Costa",
    "version": "1.0.0"
  }
}
```

#### GET /api/data/{page_id}
Retorna os dados de uma página específica.

**Parâmetros:**
- `page_id` (path): ID da página

**Resposta:** Dados dos widgets da página específica

#### GET /api/data/{page_id}/{widget_id}
Retorna os dados de um widget específico.

**Parâmetros:**
- `page_id` (path): ID da página
- `widget_id` (path): ID do widget

**Resposta:**
```json
{
  "id": "widget1",
  "title": "Produção Total",
  "value": 1250,
  "target": 1200,
  "percentage": 104,
  "status": "success",
  "color": "green"
}
```

---

### Configuração do Sistema

#### GET /api/config
Retorna a configuração geral do sistema.

**Resposta:**
```json
{
  "carousel": {
    "auto_rotate": true,
    "default_duration": 10,
    "transition_effect": "fade"
  },
  "layout": {
    "grid": "3x2",
    "responsive": true
  },
  "data": {
    "excel_file": "producao.xlsx",
    "auto_refresh": false
  },
  "styling": {
    "default_css": "producao.css",
    "theme": "dark"
  }
}
```

#### GET /api/health
Verifica o estado de saúde do sistema.

**Resposta:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:00Z",
  "version": "1.0.0",
  "services": {
    "flask": "running",
    "excel_data": "available",
    "pages": "loaded"
  }
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
  "title": "string",
  "value": "number",
  "target": "number",
  "percentage": "number",
  "status": "success|warning|danger",
  "color": "green|yellow|red"
}
```

### Page Configuration
```json
{
  "id": "string",
  "active": "boolean",
  "type": "carousel",
  "duration": "number",
  "template": "string",
  "css_file": "string",
  "widgets": "array"
}
```

## Exemplos de Uso

### Obter todas as páginas ativas
```bash
curl http://localhost:8000/api/pages
```

### Ativar uma página
```bash
curl -X POST http://localhost:8000/api/pages/producao/toggle
```

### Obter dados de uma página específica
```bash
curl http://localhost:8000/api/data/producao
```

### Verificar saúde do sistema
```bash
curl http://localhost:8000/api/health
```

## Notas de Implementação

- Todos os endpoints são síncronos
- Os dados são lidos do ficheiro Excel `data/producao.xlsx`
- As configurações das páginas são lidas dos ficheiros `config.json`
- O sistema suporta hot-reload de templates
- Os dados são atualizados a cada requisição 