# Documentação Completa - Dashboard Fabril Modular

## Índice

1. [Tecnologias](#tecnologias)
2. [Instalação Detalhada](#instalação-detalhada)
3. [Configuração de Ambiente](#configuração-de-ambiente)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Sistema Modular](#sistema-modular)
6. [Configuração de Dados](#configuração-de-dados)
7. [Funcionalidades](#funcionalidades)
8. [Design e Acessibilidade](#design-e-acessibilidade)
9. [Desenvolvimento](#desenvolvimento)
10. [Manutenção](#manutenção)
11. [Troubleshooting](#troubleshooting)

## Tecnologias

- **Backend**: Flask (Python)
- **Frontend**: HTML5, Tailwind CSS v4, JavaScript
- **Dados**: Excel (pandas/openpyxl)
- **Build Tools**: Node.js, Tailwind CLI
- **Containerização**: Docker & Docker Compose

## Instalação Detalhada

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js (versão 16 ou superior)
- Ficheiro Excel com dados (opcional - o sistema usa dados de exemplo)

### Configuração de Ambiente (.env)

Crie um ficheiro `.env` na raiz do projeto para definir variáveis de ambiente:

```
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=jayme_da_costa_dashboard_2024
PORT=8000
DEFAULT_DURATION=10
AUTO_ROTATE=true
EXCEL_FILE=producao.xlsx
AUTO_REFRESH=false
```

### Utilização com NPM Scripts

O projeto inclui scripts NPM para facilitar o desenvolvimento:

| Comando         | Descrição                                              |
|-----------------|-------------------------------------------------------|
| npm run build:css | Build do CSS para produção                            |
| npm run watch:css | Watch para desenvolvimento                            |
| npm install     | Instala dependências Node.js                          |

### Execução Local (Desenvolvimento)

1. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   npm install
   ```

2. **Build do CSS**
   ```bash
   npm run build:css
   ```

3. **Execute a aplicação**
   ```bash
   python app.py
   ```

4. **Aceda ao dashboard**
   - Dashboard: http://localhost:8000

## Estrutura do Projeto

```
pdashboard/
├── app.py                 # Aplicação Flask principal
├── requirements.txt       # Dependências Python
├── package.json           # Configuração Node.js e scripts
├── tailwind.config.js     # Configuração Tailwind CSS
├── Dockerfile            # Configuração Docker
├── docker-compose.yml    # Orquestração Docker
├── .env                  # Variáveis de ambiente
├── templates/            # Templates HTML
│   └── carousel.html     # Template único para todas as páginas
├── static/               # Ficheiros estáticos
│   ├── css/              # Estilos CSS
│   │   ├── tailwind.css  # CSS compilado do Tailwind
│   │   └── producao.css  # CSS específico para páginas
│   └── js/               # JavaScript
│       └── carousel.js   # Lógica do carrossel
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
├── data/                 # Dados Excel
│   └── producao.xlsx     # Ficheiro Excel principal
├── src/                  # Ficheiros fonte
│   └── input.css         # CSS fonte do Tailwind
└── docs/                 # Documentação
    ├── instructions.md   # Instruções do projeto
    ├── API.md           # Documentação da API
    └── DEPLOYMENT.md    # Guia de deploy
```

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

### Adicionar Nova Página

1. **Criar pasta** em `pages/nova-pagina/`
2. **Criar config.json** com a configuração da página
3. **Adicionar dados** ao Excel se necessário
4. **Reiniciar** a aplicação

## Configuração de Dados

### Estrutura do Ficheiro Excel

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

Se não existir ficheiro Excel, o sistema usa dados de exemplo para demonstração.

## Funcionalidades

### Dashboard Principal

- **Carrossel automático**: Duração configurável por página
- **Layout 3x2**: Grid de widgets para máxima utilização do ecrã
- **Sistema modular**: Cada página é independente
- **Cores indicativas**:
  - Verde: Valor >= 90% da meta
  - Amarelo: Valor entre 70-89% da meta
  - Vermelho: Valor < 70% da meta
- **Navegação manual**: Pontos clicáveis na parte inferior

### Sistema de Widgets

- **Configuração por widget**: Mapeamento de dados Excel
- **Comparação automática**: Verde/amarelo/vermelho baseado em metas
- **Dados dinâmicos**: Atualização automática dos valores

## Design e Acessibilidade

### Otimizações para TV

- **Tailwind CSS v4**: Framework CSS moderno e responsivo
- **Layout 3x2**: Grid otimizado para ecrãs de TV
- **Fontes grandes**: Legibilidade a 3-5 metros de distância
- **Alto contraste**: Cores bem definidas para visibilidade
- **Orientação landscape**: Otimizado para TVs widescreen

### Responsividade

- Adaptação automática a diferentes resoluções
- Grid responsivo para diferentes tamanhos de ecrã
- Manutenção da legibilidade em todas as resoluções

## Desenvolvimento

### Scripts de Desenvolvimento

```bash
# Build do CSS para produção
npm run build:css

# Watch para desenvolvimento
npm run watch:css
```

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

### Hot Reload

O sistema suporta hot-reload de templates através do volume Docker:
```yaml
volumes:
  - ./templates:/app/templates
```

## Manutenção

### Atualização de Dados

1. Substitua o ficheiro `data/producao.xlsx`
2. Os dados são carregados automaticamente
3. Não é necessário reiniciar a aplicação

### Atualização de Estilos

1. Modifique `src/input.css`
2. Execute `npm run build:css`
3. Recarregue a página no browser

### Atualização de Páginas

1. Modifique os ficheiros `config.json` nas pastas `pages/`
2. Os templates são recarregados automaticamente
3. Para alterações de CSS, execute `npm run build:css`

### Logs e Monitorização

```bash
# Ver logs do container
docker-compose logs dashboard

# Verificar estado do container
docker-compose ps

# Health check
curl http://localhost:8000/api/health
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

5. **Página não carrega**
   - Verifique se o Docker está a executar
   - Confirme a porta 8000 está livre

6. **Erro de permissões**
   - Verifique permissões da pasta `data/`
   - Execute `chmod 755 data/` se necessário

### Logs Úteis

```bash
# Logs da aplicação
docker-compose logs dashboard

# Logs em tempo real
docker-compose logs -f dashboard

# Verificar volumes
docker volume ls

# Verificar recursos
docker stats
```

### Suporte

Para questões técnicas ou problemas, consulte:
- Instruções do projeto em `docs/instructions.md`
- Documentação da API em `docs/API.md`
- Guia de deploy em `docs/DEPLOYMENT.md` 