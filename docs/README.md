# Dashboard Fabril Modular

## Visão Geral

Dashboard modular para TV, desenvolvido em Flask + Tailwind CSS, com dados dinâmicos de Excel e configuração por página. Ideal para ambientes industriais/fábricas.

- **Backend:** Flask (Python)
- **Frontend:** HTML5, Tailwind CSS v4, JavaScript
- **Dados:** Excel (pandas/openpyxl)
- **Containerização:** Docker & Docker Compose

## Funcionalidades Principais
- Carrossel de dashboards modulares (cada página é independente)
- Layout 3x2 otimizado para TV
- Widgets configuráveis por página
- Painel de administração para ativar/desativar/reordenar páginas
- Deploy fácil em Docker (dev e produção)

## Instalação Rápida

### 1. Clone o projeto
```bash
git clone <repo-url>
cd pdashboard
```

### 2. Ambiente de Desenvolvimento
```bash
make up
# Acesse http://localhost:8000
```

### 3. Ambiente de Produção
```bash
make build-prod
make up-prod
# Acesse http://<ip_do_servidor>:8000
```

> **Dica:** Edite `.env.development` ou `.env.production` conforme o ambiente.

## Documentação Detalhada
- [Manual do Administrador](docs/ADMIN.md)
- [Guia de Deploy](docs/DEPLOYMENT.md)
- [Instruções Técnicas](docs/instructions.md)
- [API](docs/API.md)

---

Para detalhes sobre configuração de páginas, widgets, dados, troubleshooting e personalização, consulte os documentos acima. 