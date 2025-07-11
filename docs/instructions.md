# Instruções de Implementação - PDashboard

## Visão Geral

O PDashboard é um sistema de dashboards para monitorização de performance operacional em ambiente fabril, otimizado para exibição em ecrãs de TV. O sistema foi desenvolvido para a empresa **Jayme da Costa** e implementa todas as regras de design definidas no documento `dashboard_rules.md`.

## Características Implementadas

### ✅ Funcionalidades Principais
- **Carrossel Automático**: Rotação de páginas a cada 10 segundos
- **Interface Moderna**: Design glass-morphism com cards brancos
- **Navegação Manual**: Pontos de navegação para controlo manual
- **Backoffice Admin**: Gestão completa de páginas
- **Dados Dinâmicos**: Suporte para Excel e dados de exemplo
- **Gráficos Interativos**: Chart.js para visualizações
- **Dockerização Completa**: Deploy simples e portável

### 🎨 Design Implementado
- **Glass-morphism**: Efeito de vidro com transparência
- **Cards Brancos**: Layout limpo e moderno
- **Ícones Emoji**: Interface amigável e intuitiva
- **Tipografia Clara**: Fontes grandes para legibilidade
- **Cores Consistentes**: Verde, amarelo, vermelho, azul
- **Responsivo**: Adaptado para ecrãs de TV widescreen

## Stack Tecnológico

### Backend
- **Flask**: Framework web Python
- **SQLite**: Base de dados leve
- **Pandas**: Processamento de dados Excel
- **OpenPyXL**: Leitura de ficheiros Excel

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com glass-morphism
- **JavaScript (Vanilla)**: Interatividade sem dependências
- **Chart.js**: Gráficos interativos

### Infraestrutura
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de serviços
- **Volumes**: Persistência de dados

## Estrutura do Projeto

```
pdashboard/
├── app.py                 # Aplicação Flask principal
├── database.py           # Gestão da base de dados SQLite
├── requirements.txt      # Dependências Python
├── templates/            # Templates HTML
│   ├── dashboard.html    # Template do dashboard principal
│   └── admin.html        # Template do backoffice
├── static/               # Ficheiros estáticos
│   ├── css/
│   │   └── dashboard.css # Estilos principais
│   ├── js/
│   │   └── dashboard.js  # JavaScript do dashboard
│   └── assets/           # Logos e imagens
│       ├── logo.png      # Logo principal
│       └── getsitelogo.jpeg # Logo secundário
├── data/                 # Dados Excel (volume Docker)
├── docs/                 # Documentação
│   ├── dashboard_rules.md # Regras de design
│   └── instructions.md   # Este ficheiro
├── Dockerfile           # Configuração Docker
├── docker-compose.yml   # Orquestração de containers
├── README.md            # Documentação principal
└── LICENSE              # Licença Apache 2.0
```

## Instalação e Configuração

### Pré-requisitos
- Docker
- Docker Compose
- Ficheiros Excel com dados (opcional)

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd pdashboard
   ```

2. **Prepare os dados (opcional)**
   - Coloque ficheiros Excel na pasta `data/`
   - Configure as folhas e colunas em `app.py`

3. **Execute com Docker**
   ```bash
   docker-compose up -d
   ```

4. **Aceda ao sistema**
   - Dashboard: http://localhost:8000
   - Admin: http://localhost:8000/admin

## Configuração de Dados

### Estrutura Excel Recomendada

O sistema suporta ficheiros Excel com a seguinte estrutura:

```
Produção.xlsx
├── Folha: "Produção"
│   ├── Coluna A: Família
│   ├── Coluna B: Unidades Produzidas
│   ├── Coluna C: Meta
│   └── Coluna D: Mês
├── Folha: "Previsões"
│   ├── Coluna A: Família
│   ├── Coluna B: Previsão
│   └── Coluna C: Mês
└── Folha: "Valores"
    ├── Coluna A: Valor (k€)
    ├── Coluna B: Mês
    └── Coluna C: Tipo
```

### Dados de Exemplo

Se não tiver ficheiros Excel, o sistema usa dados simulados que incluem:
- Produção mensal por família de equipamento
- Previsões para os próximos 3 meses
- Valores monetários em k€
- Gráficos de evolução

## Funcionalidades do Dashboard

### Carrossel Automático
- **Intervalo**: 10 segundos por página
- **Transição**: Efeito fade suave
- **Controlo**: Pontos de navegação na parte inferior

### Páginas Disponíveis
1. **Produção Mensal**: Dados de produção por família
2. **Previsões**: Previsões para próximos meses
3. **Valores**: Valores monetários em k€
4. **Performance**: Indicadores de performance

### Gráficos e Visualizações
- **Mini Charts**: Gráficos pequenos em cada card
- **Financial Charts**: Gráficos de barras para valores
- **Progress Bars**: Indicadores de progresso
- **Trend Indicators**: Setas de tendência

## Backoffice Admin

### Acesso
- URL: http://localhost:8000/admin
- Sem autenticação (ambiente local)

### Funcionalidades
- **Toggle Páginas**: Ativar/desativar páginas
- **Reordenação**: Drag & drop para reorganizar
- **Preview**: Visualização em tempo real
- **Persistência**: Alterações guardadas automaticamente

### Interface
- **Cards Interativos**: Clique para ativar/desativar
- **Drag & Drop**: Arrastar para reordenar
- **Feedback Visual**: Indicadores de estado
- **Responsivo**: Funciona em diferentes ecrãs

## Personalização

### Cores e Estilos
Edite `static/css/dashboard.css`:

```css
:root {
  --primary-color: #4CAF50;    /* Verde */
  --warning-color: #FF9800;    /* Amarelo */
  --danger-color: #F44336;     /* Vermelho */
  --info-color: #2196F3;       /* Azul */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --card-bg: rgba(255, 255, 255, 0.9);
}
```

### Logos
- Substitua `assets/logo.png` (logo principal)
- Substitua `assets/getsitelogo.jpeg` (logo secundário)
- Formatos suportados: PNG, JPEG, SVG

### Configuração de Dados
Edite `app.py` para configurar:
- Caminhos dos ficheiros Excel
- Estrutura das folhas
- Mapeamento de colunas
- Dados de exemplo

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
# Instalar dependências localmente
pip install -r requirements.txt

# Executar em modo desenvolvimento
python app.py
```

## Troubleshooting

### Problemas Comuns

1. **Porta 8000 em uso**
   ```bash
   # Altere no docker-compose.yml
   ports:
     - "8001:8000"
   ```

2. **Dados não carregam**
   - Verifique se os ficheiros Excel estão em `data/`
   - Confirme a estrutura das folhas
   - Verifique os logs: `docker-compose logs dashboard`

3. **Logos não aparecem**
   - Verifique se os ficheiros estão em `assets/`
   - Confirme as permissões dos ficheiros
   - Verifique o volume Docker

4. **Erro de pandas/numpy**
   ```bash
   # Rebuild com versões compatíveis
   docker-compose build --no-cache
   ```

### Logs e Debug
```bash
# Ver logs em tempo real
docker-compose logs -f dashboard

# Ver logs de erro
docker-compose logs dashboard | grep ERROR

# Verificar estado dos containers
docker-compose ps
```

## Manutenção

### Backup de Dados
- Os dados Excel são persistentes no volume `./data`
- Faça backup regular da pasta `data/`
- Considere backup da base de dados SQLite

### Atualizações
1. Pull das alterações
2. Rebuild dos containers
3. Teste em ambiente de desenvolvimento
4. Deploy em produção

### Monitorização
- Verifique logs regularmente
- Monitore uso de recursos
- Valide funcionamento dos dados

## Próximos Passos

### Melhorias Sugeridas
- [ ] Autenticação para o backoffice
- [ ] Mais tipos de gráficos
- [ ] Exportação de relatórios
- [ ] Notificações em tempo real
- [ ] Integração com APIs externas
- [ ] Temas personalizáveis
- [ ] Modo escuro/claro
- [ ] Responsividade para tablets

### Configuração Avançada
- [ ] Load balancer
- [ ] Cache Redis
- [ ] Logs estruturados
- [ ] Métricas de performance
- [ ] Health checks
- [ ] Auto-scaling

## Suporte

Para questões e suporte:
1. Consulte a documentação em `docs/`
2. Verifique os logs do sistema
3. Abra uma issue no repositório
4. Contacte a equipa de desenvolvimento

---

**Nota**: Este sistema foi desenvolvido especificamente para a Jayme da Costa e implementa todas as regras de design fabril definidas. Para uso noutras empresas, adapte os logos, cores e estrutura de dados conforme necessário.

