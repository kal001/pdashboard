# Dashboard Fabril - Jayme da Costa

Sistema de dashboard para exibição em ecrãs de TV na fábrica, mostrando informações sobre o desempenho das operações.

## Características

- **Carrossel automático**: Páginas alternam a cada 10 segundos
- **Design otimizado para TV**: Fontes grandes, alto contraste, legível a 3-5 metros
- **Dados em tempo real**: Atualização automática a cada 5 minutos
- **Painel de administração**: Gestão de páginas ativas/inativas
- **Fonte de dados Excel**: Fácil atualização por operadores
- **Completamente dockerizado**: Deploy simples e rápido

## Tecnologias

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Base de dados**: SQLite
- **Dados**: Excel (pandas/openpyxl)
- **Containerização**: Docker & Docker Compose

## Instalação e Execução

### Pré-requisitos

- Docker e Docker Compose instalados
- Ficheiro Excel com dados (opcional - o sistema usa dados de exemplo)

### Configuração de Ambiente (.env)

Crie um ficheiro `.env` na raiz do projeto para definir variáveis de ambiente:

```
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=jayme_da_costa_dashboard_2024
DATABASE_URL=sqlite:///dashboard.db
PORT=5000
```

Essas variáveis são usadas para configurar o Flask e a base de dados.

### Utilização com Makefile

O projeto inclui um `Makefile` para facilitar os comandos mais comuns:

| Comando         | Descrição                                              |
|-----------------|-------------------------------------------------------|
| make build      | Build da imagem Docker                                 |
| make up         | Sobe os containers (docker-compose up -d)             |
| make down       | Para os containers (docker-compose down)               |
| make logs       | Mostra os logs do container principal                  |
| make clean      | Remove containers, volumes e cache                     |
| make lint       | Verifica lint do Python (flake8)                       |
| make shell      | Abre um shell no container principal                   |
| make help       | Mostra todos os comandos disponíveis                   |

Exemplo de uso:

```bash
make up      # Sobe o sistema
make logs    # Mostra logs em tempo real
make down    # Para tudo
```

### Execução Rápida

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd pdashboard
   ```

2. **Execute com Makefile**
   ```bash
   make up
   ```

3. **Aceda ao dashboard**
   - Dashboard: http://localhost:5000
   - Admin: http://localhost:5000/admin

### Execução Local (Desenvolvimento)

1. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```

2. **Execute a aplicação**
   ```bash
   python app.py
   ```

3. **Aceda ao dashboard**
   - Dashboard: http://localhost:5000
   - Admin: http://localhost:5000/admin

## Estrutura do Projeto

```
pdashboard/
├── app.py                 # Aplicação Flask principal
├── requirements.txt       # Dependências Python
├── Dockerfile            # Configuração Docker
├── docker-compose.yml    # Orquestração Docker
├── .env                  # Variáveis de ambiente
├── Makefile              # Comandos automatizados
├── templates/            # Templates HTML
│   ├── dashboard.html    # Template do dashboard
│   └── admin.html        # Template do painel admin
├── static/               # Ficheiros estáticos
│   ├── css/              # Estilos CSS
│   │   ├── dashboard.css # Estilos do dashboard
│   │   └── admin.css     # Estilos do admin
│   ├── js/               # JavaScript
│   │   ├── dashboard.js  # Lógica do dashboard
│   │   └── admin.js      # Lógica do admin
│   └── assets/           # Imagens e logos
├── data/                 # Dados Excel
│   └── README.md         # Documentação dos dados
└── docs/                 # Documentação
    ├── instructions.md   # Instruções do projeto
    └── dashboard_rules.md # Regras de design
```

## Configuração de Dados

### Estrutura do Ficheiro Excel

Crie um ficheiro `data/dashboard_data.xlsx` com 3 folhas:

1. **"production"** - Produção mensal por família
2. **"forecast"** - Previsões 3 meses
3. **"values"** - Valores totais em euros

Ver `data/README.md` para detalhes da estrutura.

### Dados de Exemplo

Se não existir ficheiro Excel, o sistema usa dados de exemplo para demonstração.

## Funcionalidades

### Dashboard Principal

- **Carrossel automático**: 10 segundos por página
- **3 tipos de páginas**:
  - Produção Mensal por Família
  - Previsão Próximos 3 Meses
  - Valor Total em €
- **Cores indicativas**:
  - Verde: Acima da meta
  - Amarelo/Laranja: Próximo da meta
  - Vermelho: Abaixo da meta
- **Informações em tempo real**: Data, hora, última atualização

### Painel de Administração

- **Gestão de páginas**: Ativar/desativar páginas
- **Reordenação**: Drag & drop para alterar ordem
- **Estado dos dados**: Verificação da fonte de dados
- **Acesso direto**: Link para visualizar dashboard

## Design e Acessibilidade

### Otimizações para TV

- **Fontes grandes**: Mínimo 24px, números principais 36px+
- **Alto contraste**: Branco sobre escuro ou vice-versa
- **Legibilidade**: Visível a 3-5 metros de distância
- **Orientação landscape**: Otimizado para TVs widescreen
- **Máximo 4 cores**: Evita confusão visual

### Responsividade

- Adaptação automática a diferentes resoluções
- Grid responsivo para diferentes tamanhos de ecrã
- Manutenção da legibilidade em todas as resoluções

## Manutenção

### Atualização de Dados

1. Substitua o ficheiro `data/dashboard_data.xlsx`
2. Os dados são carregados automaticamente
3. Não é necessário reiniciar a aplicação

### Atualização de Estilos

1. Modifique os ficheiros CSS em `static/css/`
2. Recarregue a página no browser
3. Para produção, reconstrua o container Docker

### Logs e Monitorização

```bash
# Ver logs do container
make logs

# Verificar estado do container
docker-compose ps
```

## Troubleshooting

### Problemas Comuns

1. **Página não carrega**
   - Verifique se o Docker está a executar
   - Confirme a porta 5000 está livre

2. **Dados não aparecem**
   - Verifique se o ficheiro Excel existe em `data/`
   - Confirme a estrutura das folhas do Excel

3. **Erro de permissões**
   - Verifique permissões da pasta `data/`
   - Execute `chmod 755 data/` se necessário

### Suporte

Para questões técnicas ou problemas, consulte:
- Documentação em `docs/`
- Regras de design em `docs/dashboard_rules.md`
- Estrutura de dados em `data/README.md`

## Licença

Projeto desenvolvido para Jayme da Costa. 