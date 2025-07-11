# Dashboard Fabril - Jayme da Costa

Sistema de dashboard para exibição em ecrãs de TV na fábrica, mostrando informações sobre o desempenho das operações.

## Características

- **Carrossel automático**: Páginas alternam a cada 10 segundos
- **Design otimizado para TV**: Fontes grandes, alto contraste, legível a 3-5 metros
- **Dados em tempo real**: Atualização automática a cada 5 minutos
- **Painel de administração**: Gestão de páginas ativas/inativas
- **Fonte de dados Excel**: Fácil atualização por operadores
- **Completamente dockerizado**: Deploy simples e rápido

## Instalação Rápida

### Pré-requisitos
- Docker e Docker Compose

### Execução
```bash
git clone <repository-url>
cd pdashboard
make up
```

### Acesso
- **Dashboard**: http://localhost:8000
- **Admin**: http://localhost:8000/admin

## Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `make up` | Inicia o servidor |
| `make down` | Para o servidor |
| `make logs` | Mostra logs |
| `make help` | Lista todos os comandos |

## Documentação

Para instruções detalhadas, configuração avançada e troubleshooting, consulte a [documentação completa](docs/).

## Licença

Este projeto está licenciado sob a Licença Apache 2.0 - veja o ficheiro [LICENSE](LICENSE) para detalhes. 