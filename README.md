# PDashboard - Dashboard Fabril Modular

Sistema modular para dashboards industriais, otimizado para TV, com configuração por página e dados dinâmicos de Excel.

## Principais Funcionalidades
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

> Edite `.env.development` ou `.env.production` conforme o ambiente.

## Documentação
- [Manual do Administrador](docs/ADMIN.md)
- [Guia de Deploy](docs/DEPLOYMENT.md)
- [Instruções Técnicas](docs/instructions.md)
- [API](docs/API.md)

---

Para detalhes sobre configuração, personalização, troubleshooting e contribuições, consulte os documentos acima. 