# PDashboard - Dashboard Fabril Modular

![Version](https://img.shields.io/badge/version-1.0.4-blue.svg)

Sistema modular para dashboards industriais, otimizado para TV, com configuração por página e dados dinâmicos de Excel.

## Principais Funcionalidades
- Carrossel de dashboards modulares (cada página é independente)
- Layout 3x2 otimizado para TV
- Widgets configuráveis por página
- Painel de administração para ativar/desativar/reordenar páginas
- Deploy fácil em Docker (dev e produção)
- **API REST completa** com documentação interativa
- **Auto-reload automático** dos clientes quando há alterações
- **Sistema de versão em tempo real** (sem reiniciar containers)

## Atualizações em Tempo Real
- **Auto-Reload**: Todos os dashboards conectados atualizam automaticamente
- **Detecção Inteligente**: Verifica mudanças na configuração a cada 30 segundos
- **Sincronização Multi-Client**: Múltiplos displays mantêm-se sincronizados
- **Zero Intervenção**: Não é necessário refrescar manualmente os browsers

### O que Dispara Atualizações Automáticas
- ✅ Ativar/desativar páginas no painel admin
- ✅ Reordenar páginas via drag & drop
- ✅ Alterações nos ficheiros de configuração
- ✅ Modificações via API REST

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
# API Docs: http://localhost:8000/api/v1/docs/
```
> **Nota:** Usa `.env.development` automaticamente (debug ativado, hot reload)

### 3. Ambiente de Produção
```bash
make build-prod
make up-prod
# Acesse http://<ip_do_servidor>:8000
# API Docs: http://<ip_do_servidor>:8000/api/v1/docs/
```
> **Nota:** Usa `.env.production` automaticamente (debug desativado, otimizações)

> **Dica:** Edite `.env.development` ou `.env.production` conforme o ambiente.

## Documentação
- [Manual do Administrador](docs/ADMIN.md)
- [Guia de Deploy](docs/DEPLOYMENT.md)
- [Instruções Técnicas](docs/instructions.md)
- [API](docs/API.md)

---

Para detalhes sobre configuração, personalização, troubleshooting e contribuições, consulte os documentos acima. 