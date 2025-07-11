# Guia de Deploy - PDashboard

## Visão Geral

Este guia fornece instruções detalhadas para deploy do PDashboard modular em diferentes ambientes, desde desenvolvimento local até produção.

## Ambientes Suportados

### Desenvolvimento Local
- Docker Desktop (macOS/Windows)
- Docker Engine (Linux)
- Docker Compose
- Node.js (para build do CSS)

### Produção
- Servidor Linux
- Docker Engine
- Docker Compose
- Node.js (para build do CSS)
- Nginx (opcional)
- SSL/TLS (opcional)

## Deploy Local

### Pré-requisitos
- Docker Desktop ou Docker Engine
- Docker Compose
- Node.js (versão 16 ou superior)
- Git

### Passos

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd pdashboard
   ```

2. **Instale as dependências Node.js**
   ```bash
   npm install
   ```

3. **Build do CSS**
   ```bash
   npm run build:css
   ```

4. **Configure os dados (opcional)**
   ```bash
   # Crie a pasta de dados
   mkdir -p data
   
   # Adicione o ficheiro Excel principal
   cp /path/to/your/producao.xlsx data/
   ```

5. **Configure as páginas modulares**
   ```bash
   # Edite as configurações das páginas
   nano pages/producao/config.json
   nano pages/previsoes/config.json
   # ... outras páginas
   ```

6. **Execute o sistema**
   ```bash
   docker-compose up -d
   ```

7. **Verifique o funcionamento**
   ```bash
   # Verifique os logs
   docker-compose logs dashboard
   
   # Verifique o estado dos containers
   docker-compose ps
   ```

8. **Aceda ao sistema**
   - Dashboard: http://localhost:8000

### Comandos Úteis

```bash
# Build do CSS
npm run build:css

# Watch CSS (desenvolvimento)
npm run watch:css

# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Rebuild
docker-compose build --no-cache

# Logs em tempo real
docker-compose logs -f dashboard

# Shell no container
docker-compose exec dashboard bash

# Backup dos dados
tar -czf backup-$(date +%Y%m%d).tar.gz data/
```

## Deploy em Produção

### Configuração do Servidor

#### Pré-requisitos do Sistema
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose git curl nodejs npm

# CentOS/RHEL
sudo yum install -y docker docker-compose git curl nodejs npm

# Iniciar e habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar utilizador ao grupo docker
sudo usermod -aG docker $USER

# Verificar Node.js
node --version
npm --version
```

#### Configuração de Rede
```bash
# Configurar firewall (se necessário)
sudo ufw allow 8000/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### Deploy com Docker Compose

1. **Clone e configure**
   ```bash
   git clone <repository-url>
   cd pdashboard
   
   # Instale dependências Node.js
   npm install
   
   # Build do CSS para produção
   npm run build:css
   ```

2. **Configure o ambiente de produção**
   ```bash
   # Edite docker-compose.yml para produção
   nano docker-compose.yml
   ```

   ```yaml
   version: '3.8'
   services:
     dashboard:
       build: .
       ports:
         - "8000:8000"
       environment:
         - FLASK_ENV=production
         - PORT=8000
       volumes:
         - ./data:/app/data
         - ./templates:/app/templates
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
         interval: 30s
         timeout: 10s
         retries: 3
   ```

3. **Configure as páginas modulares**
   ```bash
   # Ative apenas as páginas necessárias
   nano pages/producao/config.json
   # {"active": true, "duration": 10, ...}
   
   nano pages/previsoes/config.json
   # {"active": true, "duration": 8, ...}
   ```

4. **Execute o deploy**
   ```bash
   # Build e deploy
   docker-compose up -d --build
   
   # Verifique o status
   docker-compose ps
   docker-compose logs dashboard
   ```

### Deploy com Nginx (Recomendado)

#### Configuração Nginx
```bash
# Instalar Nginx
sudo apt install -y nginx

# Configurar proxy reverso
sudo nano /etc/nginx/sites-available/pdashboard
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Cache para ficheiros estáticos
    location /static/ {
        proxy_pass http://localhost:8000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Ativar o site
sudo ln -s /etc/nginx/sites-available/pdashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Deploy com SSL/TLS

#### Certbot (Let's Encrypt)
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d your-domain.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Configuração Avançada

### Variáveis de Ambiente

Crie um ficheiro `.env`:
```bash
# Ambiente
FLASK_ENV=production
PORT=8000

# Configuração do carrossel
DEFAULT_DURATION=10
AUTO_ROTATE=true

# Configuração de dados
EXCEL_FILE=producao.xlsx
AUTO_REFRESH=false
```

### Configuração de Páginas

Cada página pode ser configurada independentemente:

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

### Configuração de Widgets

Os widgets são configurados para ler dados do Excel:

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

## Monitorização e Manutenção

### Health Checks
```bash
# Verificar saúde da aplicação
curl http://localhost:8000/api/health

# Verificar logs
docker-compose logs dashboard

# Verificar recursos
docker stats
```

### Backup e Restore
```bash
# Backup dos dados
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# Backup das configurações
tar -czf config-backup-$(date +%Y%m%d).tar.gz pages/

# Restore
tar -xzf backup-20240115.tar.gz
```

### Atualizações
```bash
# Pull das alterações
git pull origin main

# Rebuild do CSS
npm run build:css

# Rebuild dos containers
docker-compose down
docker-compose up -d --build
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

# Verificar recursos
docker stats
```

## Segurança

### Firewall
```bash
# Configurar firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Docker Security
```bash
# Executar como utilizador não-root
docker run --user 1000:1000 ...

# Limitar recursos
docker run --memory=512m --cpus=1 ...
```

### SSL/TLS
- Sempre use HTTPS em produção
- Configure renovação automática de certificados
- Use headers de segurança

## Performance

### Otimizações
- Use Nginx para servir ficheiros estáticos
- Configure cache para CSS/JS
- Use compressão gzip
- Monitore uso de recursos

### Scaling
```bash
# Múltiplas instâncias
docker-compose up -d --scale dashboard=3

# Load balancer
# Configure Nginx como load balancer
```

## Suporte

Para questões de deploy:
1. Verifique os logs da aplicação
2. Consulte a documentação em `docs/`
3. Verifique a configuração do sistema
4. Abra uma issue no repositório 