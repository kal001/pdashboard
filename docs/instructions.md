# Instruções de Implementação - PDashboard

## Visão Geral

O PDashboard é um sistema de dashboards modular para monitorização de performance operacional em ambiente fabril, otimizado para exibição em ecrãs de TV. O sistema foi desenvolvido para a empresa **Jayme da Costa** e implementa todas as regras de design definidas no documento `dashboard_rules.md`.

## Características Implementadas

### ✅ Funcionalidades Principais
- **Sistema Modular**: Cada página é um módulo independente com configuração própria
- **Carrossel Automático**: Rotação de páginas com duração configurável por página
- **Interface Moderna**: Design responsivo com Tailwind CSS v4
- **Navegação Manual**: Pontos de navegação para controlo manual
- **Dados Dinâmicos**: Suporte para Excel com configuração por widget
- **Layout 3x2**: Grid de widgets otimizado para TV
- **Dockerização Completa**: Deploy simples e portável
- **API REST Completa**: Endpoints para gestão programática e integração

### 🔌 API e Integração
- **Documentação Interativa**: Swagger UI em `/api/v1/docs/`
- **Endpoints REST**: Gestão de páginas, widgets e dados via API
- **Automação**: Integração com sistemas externos
- **Teste Direto**: Execute endpoints diretamente no navegador

### ⚡ Atualizações em Tempo Real
- **Auto-Reload**: Todos os dashboards conectados atualizam automaticamente
- **Detecção Inteligente**: Verifica mudanças na configuração a cada 30 segundos
- **Sincronização Multi-Client**: Múltiplos displays mantêm-se sincronizados
- **Zero Intervenção**: Não é necessário refrescar manualmente os browsers

### ⚙️ Configuração de Ambiente
- **`.env.development`**: Configurações para desenvolvimento (debug, hot reload)
- **`.env.production`**: Configurações para produção (otimizações, segurança)
- **Automático**: Docker Compose usa o arquivo correto baseado no comando

### 🎨 Design Implementado
- **Tailwind CSS v4**: Framework CSS moderno e responsivo
- **Layout 3x2**: Grid de widgets para máxima utilização do ecrã
- **Tipografia Clara**: Fontes grandes para legibilidade em TV
- **Cores Consistentes**: Verde (sucesso), amarelo (aviso), vermelho (perigo), azul (info)
- **Responsivo**: Adaptado para ecrãs de TV widescreen
- **CSS Modular**: Estilos específicos por página

## Stack Tecnológico

### Backend
- **Flask**: Framework web Python
- **Pandas**: Processamento de dados Excel
- **OpenPyXL**: Leitura de ficheiros Excel

### Frontend
- **HTML5**: Estrutura semântica
- **Tailwind CSS v4**: Framework CSS moderno
- **JavaScript (Vanilla)**: Interatividade sem dependências

### Infraestrutura
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de serviços
- **Volumes**: Persistência de dados

### Build Tools
- **Node.js**: Para build do Tailwind CSS
- **Tailwind CLI**: Compilação de CSS otimizado

## Estrutura do Projeto

```
pdashboard/
├── app.py                 # Aplicação Flask principal
├── requirements.txt      # Dependências Python
├── templates/            # Templates HTML
│   └── carousel.html     # Template único para todas as páginas
├── static/               # Ficheiros estáticos
│   ├── css/
│   │   ├── tailwind.css  # CSS compilado do Tailwind
│   │   └── producao.css  # CSS específico para páginas
│   └── js/
│       └── carousel.js   # JavaScript do carrossel
├── pages/                # Páginas modulares
│   ├── producao/         # Página de produção
│   │   ├── config.json   # Configuração da página
│   │   └── widgets.json  # Configuração dos widgets
│   ├── previsoes/        # Página de previsões
│   │   └── config.json
│   ├── valores/          # Página de valores
│   │   └── config.json
│   └── performance/      # Página de performance
│       └── config.json
├── data/                 # Dados Excel (volume Docker)
│   └── producao.xlsx     # Ficheiro Excel com dados
├── src/                  # Ficheiros fonte
│   └── input.css         # CSS fonte do Tailwind
├── docs/                 # Documentação
│   ├── dashboard_rules.md # Regras de design
│   └── instructions.md   # Este ficheiro
├── package.json          # Configuração Node.js e scripts
├── tailwind.config.js    # Configuração Tailwind CSS
├── Dockerfile           # Configuração Docker
├── docker-compose.yml   # Orquestração de containers
└── README.md            # Documentação principal
```

## Instalação e Configuração

### Pré-requisitos
- Docker
- Docker Compose
- Node.js (para desenvolvimento local)

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd pdashboard
   ```

2. **Instale as dependências Node.js (para build do CSS)**
   ```bash
   npm install
   ```

3. **Build do CSS**
   ```bash
   npm run build:css
   ```

4. **Execute com Docker**
   ```bash
   docker-compose up -d
   ```

5. **Aceda ao sistema**
   - Dashboard: http://localhost:8000
   - API Docs: http://localhost:8000/api/v1/docs/

> **Nota:** O sistema usa `.env.development` automaticamente para desenvolvimento.

## Implementação do Auto-Reload

### Como Funciona
O sistema implementa auto-reload através de:

1. **Polling Inteligente**: Verifica mudanças na configuração a cada 30 segundos
2. **Hash-based Detection**: Cria um hash da configuração para detectar alterações
3. **Auto-refresh**: Recarrega automaticamente quando detecta mudanças

### Ficheiros Envolvidos
- `static/js/carousel.js`: Lógica de detecção de mudanças
- `templates/carousel.html`: Inclui o script de auto-reload
- `app.py`: Endpoints para verificação de configuração

### Configuração
- **Intervalo de verificação**: 30 segundos (configurável)
- **Detecção**: Baseada em hash da configuração das páginas
- **Trigger**: Qualquer mudança em `config.json` ou via API

### Benefícios Técnicos
- **Leve**: Polling simples, sem WebSockets complexos
- **Confiável**: Funciona mesmo com conexões instáveis
- **Escalável**: Funciona com múltiplos clientes
- **Configurável**: Intervalo ajustável conforme necessidades

### O que Dispara Atualizações
- ✅ Ativar/desativar páginas no painel admin
- ✅ Reordenar páginas via drag & drop
- ✅ Alterações nos ficheiros `config.json`
- ✅ Modificações via API REST
- ✅ Qualquer mudança na configuração das páginas

## Sistema Modular

## Gerenciamento de Versão e Changelog

### Como atualizar a versão do sistema

1. **Atualize a versão:**
   - Execute: `make version-update VERSION=X.Y.Z`
   - Exemplo: `make version-update VERSION=1.1.0`
   - Isso atualiza o arquivo `VERSION` e propaga a versão para o frontend, API, admin e Swagger.

2. **Atualize o changelog:**
   - Edite o arquivo `CHANGELOG.md` e adicione uma nova entrada para a versão.
   - Siga o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

3. **Rebuild e deploy:**
   - Rode `docker-compose build --no-cache && docker-compose up -d` para aplicar a nova versão.

4. **Verifique:**
   - Use `make version` ou acesse `/api/version` para conferir a versão ativa.
   - A versão aparecerá no admin, dashboard, API e documentação.

### Comandos úteis
- `make version` — Mostra a versão atual
- `make version-info` — Mostra detalhes da versão
- `make version-update VERSION=X.Y.Z` — Atualiza a versão
- `make changelog` — Mostra o changelog estruturado

---