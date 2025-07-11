# API Documentation - PDashboard

## Visão Geral

A API do PDashboard fornece endpoints para gestão de páginas, dados e configuração do sistema. Todos os endpoints retornam dados em formato JSON.

## Base URL

```
http://localhost:8000
```

## Endpoints

### Dashboard Principal

#### GET /
Retorna a página principal do dashboard.

**Resposta:** HTML da página do dashboard

---

### Backoffice Admin

#### GET /admin
Retorna a interface de administração.

**Resposta:** HTML da página de administração

---

### Gestão de Páginas

#### GET /api/pages
Retorna a lista de todas as páginas com seu estado atual.

**Resposta:**
```json
{
  "pages": [
    {
      "id": 1,
      "title": "Produção Mensal",
      "active": true,
      "order": 1,
      "type": "production"
    },
    {
      "id": 2,
      "title": "Previsões",
      "active": true,
      "order": 2,
      "type": "forecast"
    },
    {
      "id": 3,
      "title": "Valores",
      "active": false,
      "order": 3,
      "type": "financial"
    },
    {
      "id": 4,
      "title": "Performance",
      "active": true,
      "order": 4,
      "type": "performance"
    }
  ]
}
```

#### POST /api/pages/{id}/toggle
Ativa ou desativa uma página específica.

**Parâmetros:**
- `id` (path): ID da página

**Resposta:**
```json
{
  "success": true,
  "message": "Página ativada/desativada com sucesso",
  "page": {
    "id": 1,
    "active": true
  }
}
```

#### POST /api/pages/reorder
Reordena as páginas baseado na nova ordem fornecida.

**Body:**
```json
{
  "order": [1, 3, 2, 4]
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
Retorna todos os dados necessários para o dashboard.

**Resposta:**
```json
{
  "production": {
    "families": [
      {
        "name": "Família A",
        "produced": 150,
        "target": 140,
        "percentage": 107,
        "status": "success",
        "trend": [120, 130, 140, 150]
      },
      {
        "name": "Família B",
        "produced": 95,
        "target": 100,
        "percentage": 95,
        "status": "warning",
        "trend": [110, 105, 100, 95]
      }
    ],
    "total_produced": 245,
    "total_target": 240,
    "overall_percentage": 102
  },
  "forecast": {
    "months": ["Janeiro", "Fevereiro", "Março"],
    "families": [
      {
        "name": "Família A",
        "values": [160, 170, 180]
      },
      {
        "name": "Família B",
        "values": [110, 115, 120]
      }
    ]
  },
  "financial": {
    "current_month": 1250,
    "previous_month": 1180,
    "trend": [1000, 1050, 1100, 1150, 1180, 1250],
    "months": ["Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  },
  "performance": {
    "indicators": [
      {
        "name": "Eficiência",
        "value": 87,
        "target": 90,
        "status": "warning"
      },
      {
        "name": "Qualidade",
        "value": 98,
        "target": 95,
        "status": "success"
      },
      {
        "name": "Disponibilidade",
        "value": 92,
        "target": 95,
        "status": "warning"
      }
    ]
  },
  "metadata": {
    "last_update": "2024-01-15T14:30:00Z",
    "company": "Jayme da Costa",
    "version": "1.0.0"
  }
}
```

#### GET /api/data/production
Retorna apenas os dados de produção.

**Resposta:** Subset dos dados de produção do endpoint `/api/data`

#### GET /api/data/forecast
Retorna apenas os dados de previsão.

**Resposta:** Subset dos dados de previsão do endpoint `/api/data`

#### GET /api/data/financial
Retorna apenas os dados financeiros.

**Resposta:** Subset dos dados financeiros do endpoint `/api/data`

#### GET /api/data/performance
Retorna apenas os dados de performance.

**Resposta:** Subset dos dados de performance do endpoint `/api/data`

---

### Configuração do Sistema

#### GET /api/config
Retorna a configuração atual do sistema.

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

---

### Health Check

#### GET /api/health
Verifica o estado de saúde da aplicação.

**Resposta:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:00Z",
  "version": "1.0.0",
  "database": "connected",
  "data_files": "loaded"
}
```

---

## Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Erro de requisição |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

## Estruturas de Dados

### Página (Page)
```json
{
  "id": 1,
  "title": "Nome da Página",
  "active": true,
  "order": 1,
  "type": "production"
}
```

### Família de Produção (Production Family)
```json
{
  "name": "Nome da Família",
  "produced": 150,
  "target": 140,
  "percentage": 107,
  "status": "success",
  "trend": [120, 130, 140, 150]
}
```

### Indicador de Performance (Performance Indicator)
```json
{
  "name": "Nome do Indicador",
  "value": 87,
  "target": 90,
  "status": "warning"
}
```

## Status Codes

### Status de Produção
- `success`: Produção acima da meta (verde)
- `warning`: Produção próxima da meta (amarelo)
- `danger`: Produção abaixo da meta (vermelho)

### Status de Performance
- `success`: Valor acima do target
- `warning`: Valor próximo do target
- `danger`: Valor abaixo do target

## Exemplos de Uso

### JavaScript - Carregar Dados
```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    console.log('Dados carregados:', data);
    updateDashboard(data);
  })
  .catch(error => {
    console.error('Erro ao carregar dados:', error);
  });
```

### JavaScript - Toggle Página
```javascript
fetch('/api/pages/1/toggle', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Página atualizada:', data.message);
  }
});
```

### JavaScript - Reordenar Páginas
```javascript
fetch('/api/pages/reorder', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    order: [1, 3, 2, 4]
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Páginas reordenadas');
  }
});
```

## Limitações

- Todos os endpoints são de leitura exceto os de gestão de páginas
- Não há autenticação (ambiente local)
- Dados são carregados de ficheiros Excel ou simulados
- Cache não implementado

## Versionamento

A API está na versão 1.0.0. Mudanças futuras serão documentadas com versionamento semântico.

## Suporte

Para questões sobre a API:
1. Verifique os logs da aplicação
2. Teste os endpoints com ferramentas como Postman
3. Consulte a documentação de desenvolvimento
4. Abra uma issue no repositório 