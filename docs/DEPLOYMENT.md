# Guia de Deploy - PDashboard

## Visão Geral

Este guia fornece instruções detalhadas para deploy do PDashboard em diferentes ambientes, desde desenvolvimento local até produção.

## Ambientes Suportados

### Desenvolvimento Local
- Docker Desktop (macOS/Windows)
- Docker Engine (Linux)
- Docker Compose

### Produção
- Servidor Linux
- Docker Engine
- Docker Compose
- Nginx (opcional)
- SSL/TLS (opcional)

## Deploy Local

### Pré-requisitos
- Docker Desktop ou Docker Engine
- Docker Compose
- Git

### Passos

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd pdashboard
   ```

2. **Configure os dados (opcional)**
   ```bash
   # Crie a pasta de dados
   mkdir -p data
   
   # Adicione ficheiros Excel
   cp /path/to/your/excel/files/*.xlsx data/
   ```

3. **Configure os logos**
   ```bash
   # Substitua os logos da empresa
   cp /path/to/company/logo.png static/assets/logo.png
   cp /path/to/company/getsitelogo.jpeg static/assets/getsitelogo.jpeg
   ```

4. **Execute o sistema**
   ```bash
   docker-compose up -d
   ```

5. **Verifique o funcionamento**
   ```bash
   # Verifique os logs
   docker-compose logs dashboard
   
   # Verifique o estado dos containers
   docker-compose ps
   ```

6. **Aceda ao sistema**
   - Dashboard: http://localhost:8000
   - Admin: http://localhost:8000/admin

### Comandos Úteis

```bash
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
sudo apt install -y docker.io docker-compose git curl

# CentOS/RHEL
sudo yum install -y docker docker-compose git curl

# Iniciar e habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar utilizador ao grupo docker
sudo usermod -aG docker $USER
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
   
   # Configure variáveis de ambiente
   cp .env.example .env
   nano .env
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
         - ./static/assets:/app/static/assets
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
         interval: 30s
         timeout: 10s
         retries: 3
   ```

3. **Execute o deploy**
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

#### Docker Compose com Nginx
```yaml
version: '3.8'
services:
  dashboard:
    build: .
    expose:
      - "8000"
    environment:
      - FLASK_ENV=production
    volumes:
      - ./data:/app/data
      - ./static/assets:/app/static/assets
    restart: unless-stopped
    networks:
      - dashboard-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - dashboard
    restart: unless-stopped
    networks:
      - dashboard-network

networks:
  dashboard-network:
    driver: bridge
```

### SSL/TLS com Let's Encrypt

#### Instalação Certbot
```bash
# Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d your-domain.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Configuração Nginx com SSL
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Monitorização e Manutenção

### Logs e Monitorização
```bash
# Logs da aplicação
docker-compose logs -f dashboard

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Monitorização de recursos
docker stats

# Health check
curl http://localhost:8000/api/health
```

### Backup e Restore
```bash
# Script de backup automático
#!/bin/bash
BACKUP_DIR="/backup/pdashboard"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar backup
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/data_$DATE.tar.gz data/
tar -czf $BACKUP_DIR/config_$DATE.tar.gz docker-compose.yml .env

# Limpar backups antigos (manter últimos 7 dias)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup criado: $BACKUP_DIR/data_$DATE.tar.gz"
```

### Atualizações
```bash
# Script de atualização
#!/bin/bash
echo "Iniciando atualização do PDashboard..."

# Backup antes da atualização
./backup.sh

# Pull das alterações
git pull origin main

# Rebuild e restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verificar status
docker-compose ps
curl http://localhost:8000/api/health

echo "Atualização concluída!"
```

## Configurações Avançadas

### Variáveis de Ambiente
```bash
# .env
FLASK_ENV=production
PORT=8000
DATABASE_URL=sqlite:///data/dashboard.db
LOG_LEVEL=INFO
CAROUSEL_INTERVAL=10000
COMPANY_NAME="Jayme da Costa"
```

### Dockerfile Otimizado
```dockerfile
FROM python:3.11-slim

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar requirements primeiro para cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Criar utilizador não-root
RUN useradd -m -u 1000 dashboard && \
    chown -R dashboard:dashboard /app
USER dashboard

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

EXPOSE 8000
CMD ["python", "app.py"]
```

### Docker Compose para Produção
```yaml
version: '3.8'
services:
  dashboard:
    build: .
    expose:
      - "8000"
    environment:
      - FLASK_ENV=production
      - PORT=8000
    volumes:
      - ./data:/app/data
      - ./static/assets:/app/static/assets
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - dashboard-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - dashboard
    restart: unless-stopped
    networks:
      - dashboard-network

networks:
  dashboard-network:
    driver: bridge

volumes:
  data:
  logs:
```

## Troubleshooting

### Problemas Comuns

1. **Porta em uso**
   ```bash
   # Verificar portas em uso
   sudo netstat -tulpn | grep :8000
   
   # Alterar porta
   # Editar docker-compose.yml
   ports:
     - "8001:8000"
   ```

2. **Permissões de ficheiros**
   ```bash
   # Corrigir permissões
   sudo chown -R $USER:$USER data/
   sudo chown -R $USER:$USER static/assets/
   ```

3. **Dados não carregam**
   ```bash
   # Verificar logs
   docker-compose logs dashboard
   
   # Verificar ficheiros Excel
   ls -la data/
   
   # Testar API
   curl http://localhost:8000/api/data
   ```

4. **Erro de memória**
   ```bash
   # Aumentar memória Docker
   # Docker Desktop: Settings > Resources > Memory
   # Linux: /etc/docker/daemon.json
   {
     "default-shm-size": "256M"
   }
   ```

### Logs de Debug
```bash
# Logs detalhados
docker-compose logs dashboard | grep -E "(ERROR|WARNING|Exception)"

# Logs de rede
docker-compose logs nginx

# Logs do sistema
sudo journalctl -u docker.service -f
```

## Segurança

### Boas Práticas
- Use HTTPS em produção
- Configure firewall adequadamente
- Mantenha o sistema atualizado
- Use utilizadores não-root
- Faça backups regulares
- Monitore logs de segurança

### Configuração de Segurança
```bash
# Firewall básico
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Fail2ban (proteção contra ataques)
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Performance

### Otimizações
- Use Nginx como proxy reverso
- Configure cache para ficheiros estáticos
- Use imagens Docker otimizadas
- Monitore uso de recursos
- Configure logs rotation

### Monitorização de Performance
```bash
# Monitorização de recursos
docker stats

# Análise de logs
docker-compose logs dashboard | grep "response_time"

# Teste de carga
ab -n 1000 -c 10 http://localhost:8000/
```

## Suporte

Para questões de deploy:
1. Verifique os logs do sistema
2. Consulte a documentação
3. Teste em ambiente de desenvolvimento
4. Contacte a equipa de infraestrutura 