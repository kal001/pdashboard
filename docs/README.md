# Modular Industrial Dashboard

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [API and Documentation](#api-and-documentation)
4. [Real-Time Updates](#real-time-updates)
5. [Environment Configuration](#environment-configuration)
6. [Quick Installation](#quick-installation)
7. [Detailed Documents](#detailed-documents)

## Overview

Modular dashboard for TV, developed with Flask, with dynamic Excel data and per-page configuration. Ideal for industrial/factory environments.

- **Backend:** Flask (Python)
- **Frontend:** HTML5, JavaScript
- **Data:** Excel (pandas/openpyxl)
- **Containerization:** Docker & Docker Compose

## Key Features
- Modular dashboard carousel (each page is independent)
- 3x2 layout optimized for TV
- Configurable widgets per page
- Admin panel to activate/deactivate/reorder pages
- Easy Docker deployment (dev and production)
- **Complete REST API** with interactive documentation (Swagger UI)
- **Automatic client auto-reload** when changes occur

## API and Documentation
- **Interactive Documentation:** http://localhost:8000/api/v1/docs/
- **REST API:** Endpoints for page, widget, and data management
- **Swagger UI:** Test and explore all endpoints directly in the browser

## Real-Time Updates
- **Auto-Reload:** All connected dashboards update automatically
- **Smart Detection:** Checks for configuration changes every 30 seconds
- **Multi-Client Synchronization:** Multiple displays stay synchronized
- **Zero Intervention:** No need to manually refresh browsers

### What Triggers Automatic Updates
- ✅ Activate/deactivate pages in admin panel
- ✅ Reorder pages via drag & drop
- ✅ Changes to configuration files
- ✅ Modifications via REST API

## Environment Configuration

The project uses specific configuration files for each environment:

- **`.env.development`**: Configurations for development (debug enabled, hot reload)
- **`.env.production`**: Configurations for production (debug disabled, optimizations)

### Development
- Uses `.env.development` automatically with `make up`
- Debug mode enabled for development
- Hot reload for real-time changes

### Production  
- Uses `.env.production` automatically with `make up-prod`
- Debug mode disabled for security
- Performance optimizations enabled

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

### 3. Production Environment
```bash
make build-prod
make up-prod
# Access http://<server-ip>:8000
# API Docs: http://<server-ip>:8000/api/v1/docs/
```

> **Tip:** Edit `.env.development` or `.env.production` according to your environment.

## Detailed Documents

For comprehensive information about specific aspects of the system:

- [User Manual](docs/USER_MANUAL.md) - Complete user guide with screenshots and examples
- [Administrator Manual](docs/ADMIN.md) - System administration and configuration
- [Logging Guide](docs/LOGGING.md) - Logging configuration and troubleshooting
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- [Technical Instructions](docs/instructions.md) - Technical implementation details
- [API Reference](docs/API.md) - Complete REST API documentation 