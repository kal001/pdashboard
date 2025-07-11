# PDashboard - Dashboard Fabril Modular

Sistema de dashboards modular para monitorização de performance operacional em ambiente fabril, otimizado para exibição em ecrãs de TV.

## 🚀 Características

- **Sistema Modular**: Cada página é um módulo independente com configuração própria
- **Carrossel Automático**: Rotação de páginas com duração configurável por página
- **Interface Moderna**: Design responsivo com Tailwind CSS v4
- **Layout 3x2**: Grid de widgets otimizado para TV
- **Dados Dinâmicos**: Suporte para Excel com configuração por widget
- **Responsivo**: Otimizado para ecrãs de TV widescreen
- **Dockerizado**: Deploy simples e portável

## 🛠️ Tecnologias

- **Backend**: Flask (Python)
- **Frontend**: HTML5, Tailwind CSS v4, JavaScript (Vanilla)
- **Dados**: Excel (Pandas/OpenPyXL)
- **Build Tools**: Node.js, Tailwind CLI
- **Containerização**: Docker & Docker Compose

## 📋 Pré-requisitos

- Docker
- Docker Compose
- Node.js (para desenvolvimento local)

## 🚀 Instalação e Execução

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

5. **Aceda ao dashboard**
   - Dashboard: http://localhost:8000

## 📊 Estrutura do Projeto

```
pdashboard/
├── app.py                 # Aplicação Flask principal
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
├── data/                 # Dados Excel (montado como volume)
│   └── producao.xlsx     # Ficheiro Excel com dados
├── src/                  # Ficheiros fonte
│   └── input.css         # CSS fonte do Tailwind
├── docs/                 # Documentação
├── package.json          # Configuração Node.js e scripts
├── tailwind.config.js    # Configuração Tailwind CSS
├── Dockerfile           # Configuração Docker
└── docker-compose.yml   # Orquestração de containers
```

## 🎯 Funcionalidades

### Sistema Modular
- **Páginas Independentes**: Cada página é um módulo com configuração própria
- **Configuração JSON**: Definição de duração, template e CSS por página
- **Widgets Configuráveis**: Configuração de dados por widget

### Dashboard Principal
- **Carrossel Automático**: Rotação de páginas com duração configurável
- **Navegação Manual**: Pontos de navegação para controlo manual
- **Layout 3x2**: Grid de widgets para máxima utilização do ecrã
- **Design Responsivo**: Adaptado para ecrãs de TV

### Fontes de Dados
- **Ficheiro Excel Único**: `data/producao.xlsx` com múltiplas folhas
- **Configuração por Widget**: Mapeamento de folhas e colunas
- **Comparação Automática**: Verde/amarelo/vermelho baseado em metas

## 📈 Regras de Design

O dashboard segue as regras de design fabril:

- **Visibilidade**: Fontes grandes para legibilidade a 3-5m
- **Cores**: Verde (sucesso), Amarelo (atenção), Vermelho (alerta), Azul (neutro)
- **Layout**: Grid 3x2 para máxima utilização do ecrã
- **Hierarquia**: Informações importantes em maior destaque

## 🔧 Configuração

### Sistema Modular

Cada página é configurada em `pages/[página]/config.json`:

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

### Widgets

Os widgets são configurados para ler dados do Excel:

```json
{
  "id": "widget1",
  "title": "Produção Total",
  "type": "metric",
  "data_source": "producao.xlsx",
  "sheet": "Total",
  "value_column": "B",
  "target_column": "C"
}
```

### Variáveis de Ambiente
- `FLASK_ENV`: Ambiente de execução (development/production)
- `PORT`: Porta do servidor (padrão: 8000)

### Volumes Docker
- `./data:/app/data`: Dados Excel persistentes
- `./templates:/app/templates`: Templates HTML (hot reload)

## 📝 Scripts de Desenvolvimento

```bash
# Build do CSS para produção
npm run build:css

# Watch para desenvolvimento
npm run watch:css
```

## 🎨 Personalização

### CSS Global
Edite `src/input.css` para estilos globais.

### CSS por Página
Crie ficheiros CSS específicos e referencie em `config.json`:
```json
{
  "css_file": "minha-pagina.css"
}
```

### Dados
- Configure o ficheiro `data/producao.xlsx` com suas folhas
- Ajuste a configuração dos widgets em `widgets.json`
- Os dados são automaticamente carregados

## 🐛 Troubleshooting

### Problemas Comuns

1. **CSS não atualiza**
   ```bash
   # Rebuild do CSS
   npm run build:css
   ```

2. **Páginas não aparecem**
   - Verifique se `active: true` em `config.json`
   - Confirme a estrutura das pastas

3. **Dados não carregam**
   - Verifique se `producao.xlsx` está em `data/`
   - Confirme a estrutura das folhas

### Logs
```bash
docker-compose logs dashboard
```

## 📄 Licença

Este projeto está licenciado sob a Licença Apache 2.0 - veja o ficheiro [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para a sua feature
3. Commit as suas alterações
4. Push para a branch
5. Abra um Pull Request

## 📚 Documentação

Para documentação detalhada, consulte os ficheiros na pasta `docs/`:

- **[Instruções de Implementação](docs/instructions.md)** - Guia completo de implementação e configuração
- **[Documentação da API](docs/API.md)** - Referência completa da API REST
- **[Guia de Deploy](docs/DEPLOYMENT.md)** - Instruções de deploy local e produção

## 📞 Suporte

Para questões e suporte, consulte a documentação detalhada em `docs/` ou abra uma issue no repositório. 