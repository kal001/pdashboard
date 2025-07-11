# PDashboard - Dashboard Fabril

Sistema de dashboards para monitorização de performance operacional em ambiente fabril, otimizado para exibição em ecrãs de TV.

## 🚀 Características

- **Interface Moderna**: Design glass-morphism com cards brancos e navegação intuitiva
- **Carrossel Automático**: Rotação de páginas a cada 10 segundos
- **Dados Dinâmicos**: Suporte para ficheiros Excel e dados de exemplo
- **Backoffice Admin**: Gestão de páginas ativas/inativas e reordenação
- **Responsivo**: Otimizado para ecrãs de TV widescreen
- **Dockerizado**: Deploy simples e portável

## 🛠️ Tecnologias

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Base de Dados**: SQLite
- **Gráficos**: Chart.js
- **Containerização**: Docker & Docker Compose

## 📋 Pré-requisitos

- Docker
- Docker Compose

## 🚀 Instalação e Execução

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd pdashboard
   ```

2. **Execute com Docker**
   ```bash
   docker-compose up -d
   ```

3. **Aceda ao dashboard**
   - Dashboard: http://localhost:8000
   - Admin: http://localhost:8000/admin

## 📊 Estrutura do Projeto

```
pdashboard/
├── app.py                 # Aplicação Flask principal
├── database.py           # Gestão da base de dados
├── templates/            # Templates HTML
│   ├── dashboard.html    # Template do dashboard
│   └── admin.html        # Template do backoffice
├── static/               # Ficheiros estáticos
│   ├── css/
│   │   └── dashboard.css # Estilos principais
│   ├── js/
│   │   └── dashboard.js  # JavaScript do dashboard
│   └── assets/           # Logos e imagens
├── data/                 # Dados Excel (montado como volume)
├── docs/                 # Documentação
├── Dockerfile           # Configuração Docker
└── docker-compose.yml   # Orquestração de containers
```

## 🎯 Funcionalidades

### Dashboard Principal
- **Carrossel Automático**: Rotação de páginas a cada 10 segundos
- **Navegação Manual**: Pontos de navegação para controlo manual
- **Gráficos Interativos**: Chart.js para visualizações
- **Design Responsivo**: Adaptado para ecrãs de TV

### Backoffice Admin
- **Gestão de Páginas**: Ativar/desativar páginas
- **Reordenação**: Drag & drop para reorganizar páginas
- **Preview**: Visualização em tempo real das alterações

### Fontes de Dados
- **Ficheiros Excel**: Suporte para dados reais
- **Dados de Exemplo**: Dados simulados para demonstração
- **API REST**: Endpoints para gestão de dados

## 📈 Regras de Design

O dashboard segue as regras de design fabril definidas em `docs/dashboard_rules.md`:

- **Visibilidade**: Fontes grandes (24px+) para legibilidade a 3-5m
- **Cores**: Verde (sucesso), Amarelo (atenção), Vermelho (alerta), Azul (neutro)
- **Layout**: Máximo 3 colunas, orientação landscape
- **Hierarquia**: Informações importantes em maior destaque

## 🔧 Configuração

### Variáveis de Ambiente
- `FLASK_ENV`: Ambiente de execução (development/production)
- `PORT`: Porta do servidor (padrão: 8000)

### Volumes Docker
- `./data:/app/data`: Dados Excel persistentes
- `./static/assets:/app/static/assets`: Logos e imagens

## 📝 API Endpoints

- `GET /`: Dashboard principal
- `GET /admin`: Interface de administração
- `GET /api/pages`: Lista de páginas
- `POST /api/pages/<id>/toggle`: Ativar/desativar página
- `POST /api/pages/reorder`: Reordenar páginas
- `GET /api/data`: Dados para o dashboard

## 🎨 Personalização

### Cores e Estilos
Edite `static/css/dashboard.css` para personalizar:
- Cores do tema
- Tipografia
- Layout e espaçamentos
- Efeitos visuais

### Dados
- Coloque ficheiros Excel na pasta `data/`
- Configure as folhas e colunas em `app.py`
- Os dados são automaticamente carregados

### Logos
- Substitua `assets/logo.png` e `assets/getsitelogo.jpeg`
- Os logos são automaticamente carregados

## 🐛 Troubleshooting

### Problemas Comuns

1. **Porta em uso**
   ```bash
   # Altere a porta no docker-compose.yml
   ports:
     - "8001:8000"
   ```

2. **Dados não carregam**
   - Verifique se os ficheiros Excel estão na pasta `data/`
   - Confirme a estrutura das folhas Excel

3. **Logos não aparecem**
   - Verifique se os ficheiros estão em `assets/`
   - Confirme as permissões dos ficheiros

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

## 📞 Suporte

Para questões e suporte, consulte a documentação detalhada em `docs/` ou abra uma issue no repositório. 