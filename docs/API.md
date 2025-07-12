# API Documentation - PDashboard

## Table of Contents
1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Interactive Documentation](#interactive-documentation)
4. [Client Auto-Reload](#client-auto-reload)
5. [Endpoints](#endpoints)
    - [Main Dashboard](#main-dashboard)
    - [Modular Page Management](#modular-page-management)
    - [Dashboard Data](#dashboard-data)
    - [System Configuration](#system-configuration)
    - [System Health](#system-health)

---

## Overview

The PDashboard API provides endpoints for managing modular pages, widgets, and system configuration. All endpoints return data in JSON format.

## Base URL

```
http://localhost:8000
```

## Interactive Documentation

The interactive API documentation (Swagger UI) is available at:

```
http://localhost:8000/api/v1/docs/
```

You can explore and test all endpoints directly in your browser.

## Client Auto-Reload

The system includes an auto-reload feature that automatically updates all connected dashboards when configuration changes occur:

### How It Works
- **Automatic Detection:** The dashboard checks for configuration changes every 30 seconds
- **Instant Update:** When changes are detected, the page automatically reloads
- **No Manual Intervention:** No need to manually refresh client browsers

### What Triggers Auto-Reload
- ✅ **Activate/Deactivate pages** (via admin panel or API)
- ✅ **Reorder pages** (via drag & drop in admin)
- ✅ **Changes to config.json files**
- ✅ **Any change to page configuration**

### Benefits
- **Automatic Synchronization:** All displays always show the latest configuration
- **Zero Downtime:** Updates without interrupting the display
- **Multi-Client:** Works with multiple browsers/displays simultaneously

## Endpoints

### Main Dashboard

#### GET /
Returns the main dashboard page with the modular page carousel.

**Response:** HTML of the dashboard page

---

### Modular Page Management

#### GET /api/pages
Returns the list of all modular pages with their configuration.

**Response:**
```json
{
  "pages": [
    {
      "id": "producao3",
      "active": true,
      "type": "3x2",
      "template": "carousel.html",
      "css_file": "producao.css",
      "widgets": [
        { "id": "widget1", "active": true, "name": "Linha 3 - Equipamento A", "sheet": "ModeloA" },
        { "id": "widget2", "active": true, "name": "Linha 3 - Equipamento B", "sheet": "ModeloB" }
      ]
    }
  ]
}
```

The admin panel consumes this endpoint to display, for each page, the template, css_file, and active widgets.

#### GET /api/pages/{page_id}
Returns the configuration of a specific page.

**Parameters:**
- `page_id` (path): Page ID

**Response:**
```json
{
  "id": "producao3",
  "active": true,
  "type": "3x2",
  "template": "carousel.html",
  "css_file": "producao.css",
  "widgets": [
    { "id": "widget1", "active": true, "name": "Linha 3 - Equipamento A", "sheet": "ModeloA" },
    { "id": "widget2", "active": true, "name": "Linha 3 - Equipamento B", "sheet": "ModeloB" }
  ]
}
```

#### POST /api/pages/{page_id}/toggle
Activates or deactivates a specific page.

**Parameters:**
- `page_id` (path): Page ID

**Response:**
```json
{
  "success": true,
  "message": "Page activated/deactivated successfully",
  "page": {
    "id": "producao3",
    "active": true
  }
}
```

#### POST /api/pages/reorder
Reorders the dashboard pages.

**Body:**
```json
{
  "order": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pages reordered successfully"
}
```

---

### Dashboard Data

#### GET /api/data
Returns all data needed for the dashboard based on the configuration of pages and widgets.

**Response:**
```json
{
  "pages": [
    {
      "id": "producao3",
      "widgets": [
        {
          "id": "widget1",
          "name": "Linha 3 - Equipamento A",
          "value": 1250,
          "target": 1200,
          "percent_change": 4.2,
          "trend": "▲",
          "trend_color": "green",
          "labels": ["Jan", "Feb", "Mar"],
          "chart_data": [1000, 1100, 1250],
          "value_color": "#0bda5b"
        },
        {
          "id": "widget2",
          "name": "Linha 3 - Equipamento B",
          "value": 900,
          "target": 950,
          "percent_change": -2.1,
          "trend": "▼",
          "trend_color": "red",
          "labels": ["Jan", "Feb", "Mar"],
          "chart_data": [950, 920, 900],
          "value_color": "#fa6238"
        }
      ]
    }
  ],
  "metadata": {
    "last_update": "2024-07-11T22:57:35Z",
    "company": "Company Name",
    "version": "1.0.0"
  }
}
```

#### GET /api/data/{page_id}
Returns the data for a specific page.

**Parameters:**
- `page_id` (path): Page ID

**Response:** Data for the specific page's widgets (same structure as the `widgets` array above)

#### GET /api/data/{page_id}/{widget_id}
Returns the data for a specific widget.

**Parameters:**
- `page_id` (path): Page ID
- `widget_id` (path): Widget ID

**Response:**
```json
{
  "id": "widget1",
  "name": "Linha 3 - Equipamento A",
  "value": 1250,
  "target": 1200,
  "percent_change": 4.2,
  "trend": "▲",
  "trend_color": "green",
  "labels": ["Jan", "Feb", "Mar"],
  "chart_data": [1000, 1100, 1250],
  "value_color": "#0bda5b"
}
```

---

### System Configuration

#### GET /api/config
Returns the general system configuration.

**Response:**
```json
{
  "carousel_interval": 10000,
  "company_name": "Company Name",
  "logo_primary": "/static/assets/logo.png",
  "logo_secondary": "/static/assets/getsitelogo.jpeg",
  "theme": {
    "primary_color": "#4CAF50",
    "warning_color": "#FF9800",
    "danger_color": "#F44336",
    "info_color": "#2196F3"
  }
}
```

#### GET /api/health
Checks the system health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-07-11T22:57:35Z",
  "version": "1.0.0",
  "database": "connected",
  "data_files": "loaded"
}
```

---

## Status Codes

- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Internal server error

## Data Structures

### Widget Data
```json
{
  "id": "string",
  "name": "string",
  "value": "number",
  "target": "number",
  "percent_change": "number",
  "trend": "▲|▼|→",
  "trend_color": "green|red|gray",
  "labels": ["string"],
  "chart_data": ["number"],
  "value_color": "string"
}
```

### Page Configuration
```json
{
  "id": "string",
  "active": "boolean",
  "type": "3x2",
  "template": "string",
  "css_file": "string",
  "widgets": [ ... ]
}
```

## Usage Examples

### Get all pages
```bash
curl http://localhost:8000/api/pages
```

### Activate/deactivate a page
```bash
curl -X POST http://localhost:8000/api/pages/producao3/toggle
```

### Reorder pages
```bash
curl -X POST http://localhost:8000/api/pages/reorder -H "Content-Type: application/json" -d '{"order": [1,2,3]}'
```

### Get data for a specific page
```bash
curl http://localhost:8000/api/data/producao3
```

### Get data for a specific widget
```bash
curl http://localhost:8000/api/data/producao3/widget1
```

### Check system health
```bash
curl http://localhost:8000/api/health
```

## Implementation Notes

- All endpoints are synchronous
- Data is read from the Excel file in `data/`
- Page configurations are read from `config.json` files in `pages/`
- The system supports hot-reload of templates in development
- The system is extensible for new page and widget types in the future 