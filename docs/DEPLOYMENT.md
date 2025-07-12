# Deployment Manual - Production (LXC/Proxmox)

## Environment Configuration

The project uses different configuration files for development and production:

- **`.env.development`**: Configurations for development (debug enabled, hot reload)
- **`.env.production`**: Configurations for production (debug disabled, optimizations)

### Important Variables
- `FLASK_ENV`: Defines the environment (development/production)
- `FLASK_DEBUG`: Enables/disables debug mode
- `SECRET_KEY`: Secret key for sessions (change in production!)
- `DATABASE_URL`: Database URL

## Prerequisites
- LXC or VM with Docker and Docker Compose installed
- SSH access to container/server
- Port 8000 open

## Production Deployment Steps

1. **Copy the project to LXC**
   ```bash
   scp -r pdashboard/ user@lxc_ip:/destination/path
   ```
2. **Access the container**
   ```bash
   ssh user@lxc_ip
   cd /destination/path/pdashboard
   ```
3. **Configure production environment**
   - **IMPORTANT**: Edit `.env.production` and set a secure SECRET_KEY
   - Adjust other variables as needed
   - Verify that `FLASK_ENV=production` and `FLASK_DEBUG=0`

4. **Build and start container**
   ```bash
   make build-prod
   make up-prod
   ```
5. **Verify operation**
   ```bash
   make logs-prod
   # Access http://lxc_ip:8000
   # API Docs: http://lxc_ip:8000/api/v1/docs/
   ```

## API Verification
- **Basic test:** `curl http://lxc_ip:8000/api/v1/health`
- **Documentation:** Access `http://lxc_ip:8000/api/v1/docs/`
- **Main endpoints:**
  - `GET /api/v1/pages` - List all pages
  - `GET /api/v1/data` - Dashboard data
  - `GET /api/v1/config` - System configuration

## System Update

1. **Update code**
   ```bash
   git pull
   make build-prod
   make up-prod
   ```
2. **Update data or pages**
   - Replace files in `data/` or `pages/`
   - Restart container if necessary

## Version Update

The system now supports version updates **without restarting the container**:

1. **Update version**
   ```bash
   make version-update VERSION=1.0.1
   ```
2. **Version is automatically updated** in all endpoints:
   - API: `/api/version`, `/api/health`, `/api/data`
   - Admin panel: Shows new version automatically
   - Dashboard: Version updated in footer

**Note:** The `VERSION` and `CHANGELOG.md` files are mounted as volumes, allowing real-time updates.

## Switching between Development and Production
- Use `make up` for dev (uses `.env.development`, hot reload, debug)
- Use `make up-prod` for production (uses `.env.production`, stable, no debug)

## Troubleshooting
- Check logs: `make logs-prod`
- Check variables in `.env.production`
- Check if port 8000 is open
- Use `make shell-prod` to access the container
- Test API: `curl http://localhost:8000/api/v1/health` 