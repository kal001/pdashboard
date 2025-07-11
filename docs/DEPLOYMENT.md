# Manual de Deploy - Produção (LXC/Proxmox)

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
   - Edite `.env.production` e defina um SECRET_KEY seguro
   - Ajuste outras variáveis se necessário

4. **Build e subida do container**
   ```bash
   make build-prod
   make up-prod
   ```
5. **Verifique o funcionamento**
   ```bash
   make logs-prod
   # Acesse http://ip_do_lxc:8000
   ```

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
- Use `make up` para dev (hot reload, debug)
- Use `make up-prod` para produção (estável, sem debug)

## Troubleshooting
- Verifique logs: `make logs-prod`
- Verifique variáveis em `.env.production`
- Verifique se porta 8000 está aberta
- Use `make shell-prod` para acessar o container 