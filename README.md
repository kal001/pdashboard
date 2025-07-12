# PDashboard - Modular Dashboard for Digital Signage

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)

Modular system for industrial dashboards, optimized for TV displays, with per-page configuration and dynamic Excel data.

## Key Features
- Modular dashboard carousel (each page is independent)
- 3x2 layout optimized for TV
- Configurable widgets per page
- Admin panel to activate/deactivate/reorder pages
- Easy Docker deployment (dev and production)
- **Complete REST API** with interactive documentation
- **Automatic client auto-reload** when changes occur
- **Real-time version system** (no container restart required)
- **Complete internationalization (i18n)**: fully translated and dynamic admin (Portuguese/English)
- **Multiple file upload**: select and send multiple files at once
- **Custom file input**: modern interface, fully translatable and user-friendly

## Real-Time Updates
- **Auto-Reload**: All connected dashboards update automatically
- **Smart Detection**: Checks for configuration changes every 30 seconds
- **Multi-Client Synchronization**: Multiple displays stay synchronized
- **Zero Intervention**: No need to manually refresh browsers

### What Triggers Automatic Updates
- ✅ Activate/deactivate pages in admin panel
- ✅ Reorder pages via drag & drop
- ✅ Changes to configuration files
- ✅ Modifications via REST API

## Quick Installation

### 1. Clone the project
```bash
git clone <repo-url>
cd pdashboard
```

### 2. Development Environment
```bash
make up
# Access http://localhost:8000
# API Docs: http://localhost:8000/api/v1/docs/
```
> **Note:** Uses `.env.development` automatically (debug enabled, hot reload)

### 3. Production Environment
```bash
make build-prod
make up-prod
# Access http://<server-ip>:8000
# API Docs: http://<server-ip>:8000/api/v1/docs/
```
> **Note:** Uses `.env.production` automatically (debug disabled, optimizations)

> **Tip:** Edit `.env.development` or `.env.production` according to your environment.

## Documentation
- [User Manual](docs/USER_MANUAL.md) - Complete guide for users
- [Administrator Manual](docs/ADMIN.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Technical Instructions](docs/instructions.md)
- [API](docs/API.md)

## Customization

### Logo Customization
The system uses two logo files that can be customized:

- **Main Logo**: `static/assets/logo.png` - Displayed in dashboard header and admin panel
- **Secondary Logo**: `static/assets/getsitelogo.jpeg` - Displayed alongside the main logo

**To customize logos:**
1. Replace the placeholder files in `static/assets/` with your actual logo images
2. Recommended format: PNG with transparency for main logo
3. Recommended size: 200x80 pixels (or similar aspect ratio)
4. The logos will automatically appear in the dashboard and admin interface

---

For details on configuration, customization, troubleshooting and contributions, see the documents above. 