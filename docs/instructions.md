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

## Sistema Modular

### Estrutura de Páginas

Cada página é um módulo independente na pasta `pages/` com:

#### config.json
```json
{
  "id": "producao",
  "active": true,
  "type": "carousel",
  "duration": 10,
  "template": "carousel.html",
  "css_file": "producao.css"
}
```

#### widgets.json (opcional)
```json
[
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
```

### Configuração de Widgets

Os widgets são configurados para ler dados do ficheiro Excel `data/producao.xlsx`:

- **data_source**: Nome do ficheiro Excel
- **sheet**: Nome da folha
- **value_column**: Coluna com o valor atual
- **target_column**: Coluna com o valor objetivo
- **comparison**: Comparação automática (verde/amarelo/vermelho)

## Configuração de Dados

### Estrutura Excel

O sistema usa um único ficheiro `data/producao.xlsx` com múltiplas folhas:

```
producao.xlsx
├── Folha: "Total"
│   ├── Coluna A: Mês
│   ├── Coluna B: Valor Atual
│   └── Coluna C: Meta
├── Folha: "Familia1"
│   ├── Coluna A: Mês
│   ├── Coluna B: Valor Atual
│   └── Coluna C: Meta
└── ... (outras folhas)
```

### Dados de Exemplo

O sistema inclui dados simulados que demonstram:
- Produção mensal por família de equipamento
- Comparação com metas
- Indicadores de performance
- Valores monetários

## Funcionalidades do Dashboard

### Carrossel Automático
- **Duração Configurável**: Cada página pode ter duração diferente
- **Transição Suave**: Efeito fade entre páginas
- **Navegação Manual**: Pontos clicáveis na parte inferior

### Layout 3x2
- **Grid Responsivo**: 3 colunas x 2 linhas de widgets
- **Utilização Total**: Aproveita todo o espaço do ecrã
- **Widgets Flexíveis**: Adaptam-se ao conteúdo

### Sistema de Cores
- **Verde**: Valor >= 90% da meta
- **Amarelo**: Valor entre 70-89% da meta
- **Vermelho**: Valor < 70% da meta

## Desenvolvimento

### Scripts Disponíveis

```bash
# Build do CSS para produção
npm run build:css

# Watch para desenvolvimento
npm run watch:css
```

### Adicionar Nova Página

1. **Criar pasta** em `pages/nova-pagina/`
2. **Criar config.json**:
   ```json
   {
     "id": "nova-pagina",
     "active": true,
     "type": "carousel",
     "duration": 10,
     "template": "carousel.html",
     "css_file": "producao.css"
   }
   ```
3. **Adicionar dados** ao Excel se necessário
4. **Reiniciar** a aplicação

### Personalização de Estilos

#### CSS Global
Edite `src/input.css` para estilos globais.

#### CSS por Página
Crie ficheiros CSS específicos e referencie em `config.json`:
```json
{
  "css_file": "minha-pagina.css"
}
```

## Comandos Úteis

### Docker
```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Rebuild
docker-compose build --no-cache

# Logs
docker-compose logs dashboard

# Shell no container
docker-compose exec dashboard bash
```

### Desenvolvimento
```bash
# Instalar dependências
pip install -r requirements.txt
npm install

# Build CSS
npm run build:css

# Watch CSS (desenvolvimento)
npm run watch:css

# Executar Flask
python app.py
```

## Troubleshooting

### Problemas Comuns

1. **CSS não atualiza**
   ```bash
   # Rebuild do CSS
   npm run build:css
   ```

2. **Páginas não aparecem**
   - Verifique se `active: true` em `config.json`
   - Confirme a estrutura das pastas
   - Verifique os logs: `docker-compose logs dashboard`

3. **Dados não carregam**
   - Verifique se `producao.xlsx` está em `data/`
   - Confirme a estrutura das folhas
   - Verifique os nomes das colunas

4. **Erro de Tailwind**
   ```bash
   # Reinstalar dependências
   rm -rf node_modules package-lock.json
   npm install
   npm run build:css
   ```

### Logs Úteis
```bash
# Logs da aplicação
docker-compose logs dashboard

# Logs em tempo real
docker-compose logs -f dashboard

# Verificar volumes
docker volume ls
```

## Painel de Administração

O painel de administração exibe todas as páginas modulares e permite:
- Ativar/desativar páginas
- Alterar ordem de exibição
- Visualizar, para cada página:
  - Template utilizado
  - CSS associado
  - Nomes dos widgets ativos

A informação é lida do `config.json` de cada página. Edite o `config.json` e o admin refletirá as mudanças automaticamente.

### Exemplo de config.json
```json
{
  "id": "producao3",
  "title": "Produção Linha 3",
  "active": true,
  "type": "3x2",
  "template": "carousel.html",
  "css_file": "producao.css",
  "widgets": [
    { "id": "widget1", "active": true, "name": "Linha 3 - Equipamento A" },
    { "id": "widget2", "active": true, "name": "Linha 3 - Equipamento B" }
  ]
}
```

