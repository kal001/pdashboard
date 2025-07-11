# Manual de Deploy - Produção (LXC/Proxmox)

## Configuração de Ambiente

O projeto usa diferentes arquivos de configuração para desenvolvimento e produção:

- **`.env.development`**: Configurações para desenvolvimento (debug ativado, hot reload)
- **`.env.production`**: Configurações para produção (debug desativado, otimizações)

### Variáveis Importantes
- `FLASK_ENV`: Define o ambiente (development/production)
- `FLASK_DEBUG`: Ativa/desativa debug mode
- `SECRET_KEY`: Chave secreta para sessões (mude em produção!)
- `DATABASE_URL`: URL da base de dados

## Pré-requisitos
- LXC ou VM com Docker e Docker Compose instalados
- Acesso SSH ao container/servidor
- Porta 8000 aberta

## Passos para Deploy de Produção

1. **Copie o projeto para o LXC**
   ```bash
   scp -r pdashboard/ user@ip_do_lxc:/caminho/destino
   ```
2. **Acesse o container**
   ```bash
   ssh user@ip_do_lxc
   cd /caminho/destino/pdashboard
   ```
3. **Configure o ambiente de produção**
   - **IMPORTANTE**: Edite `.env.production` e defina um SECRET_KEY seguro
   - Ajuste outras variáveis se necessário
   - Verifique que `FLASK_ENV=production` e `FLASK_DEBUG=0`

4. **Build e subida do container**
   ```bash
   make build-prod
   make up-prod
   ```
5. **Verifique o funcionamento**
   ```bash
   make logs-prod
   # Acesse http://ip_do_lxc:8000
   # API Docs: http://ip_do_lxc:8000/api/v1/docs/
   ```

## Verificação da API
- **Teste básico:** `curl http://ip_do_lxc:8000/api/v1/health`
- **Documentação:** Acesse `http://ip_do_lxc:8000/api/v1/docs/`
- **Endpoints principais:**
  - `GET /api/v1/pages` - Lista todas as páginas
  - `GET /api/v1/data` - Dados do dashboard
  - `GET /api/v1/config` - Configuração do sistema

## Atualização do Sistema

1. **Atualize o código**
   ```bash
   git pull
   make build-prod
   make up-prod
   ```
2. **Atualize dados ou páginas**
   - Substitua arquivos em `data/` ou `pages/`
   - Reinicie o container se necessário

## Alternar entre Desenvolvimento e Produção
- Use `make up` para dev (usa `.env.development`, hot reload, debug)
- Use `make up-prod` para produção (usa `.env.production`, estável, sem debug)

## Troubleshooting
- Verifique logs: `make logs-prod`
- Verifique variáveis em `.env.production`
- Verifique se porta 8000 está aberta
- Use `make shell-prod` para acessar o container
- Teste API: `curl http://localhost:8000/api/v1/health` 