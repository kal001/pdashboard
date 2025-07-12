# Implementation Instructions - PDashboard

## Overview

PDashboard is a modular dashboard system for operational performance monitoring in industrial environments, optimized for TV display. The system was developed for **Jayme da Costa** company and implements all design rules defined in the `dashboard_rules.md` document.

## Implemented Features

### ✅ Core Features
- **Modular System**: Each page is an independent module with its own configuration
- **Automatic Carousel**: Page rotation with configurable duration per page
- **Manual Navigation**: Navigation points for manual control
- **Dynamic Data**: Excel support with per-widget configuration
- **3x2 Layout**: Widget grid optimized for TV
- **Complete Dockerization**: Simple and portable deployment
- **Complete REST API**: Endpoints for programmatic management and integration

### 🔌 API and Integration
- **Interactive Documentation**: Swagger UI at `/api/v1/docs/`
- **REST Endpoints**: Page, widget, and data management via API
- **Automation**: Integration with external systems
- **Direct Testing**: Execute endpoints directly in the browser

### ⚡ Real-Time Updates
- **Auto-Reload**: All connected dashboards update automatically
- **Smart Detection**: Checks for configuration changes every 30 seconds
- **Multi-Client Synchronization**: Multiple displays stay synchronized
- **Zero Intervention**: No need to manually refresh browsers

### ⚙️ Environment Configuration
- **`.env.development`**: Configurations for development (debug, hot reload)
- **`.env.production`**: Configurations for production (optimizations, security)
- **Automatic**: Docker Compose uses the correct file based on command

### 🎨 Implemented Design
- **3x2 Layout**: Widget grid for maximum screen utilization
- **Clear Typography**: Large fonts for TV readability
- **Consistent Colors**: Green (success), yellow (warning), red (danger), blue (info)
- **Responsive**: Adapted for widescreen TV displays
- **Modular CSS**: Page-specific styles

## Technology Stack

### Backend
- **Flask**: Python web framework
- **Pandas**: Excel data processing
- **OpenPyXL**: Excel file reading

### Frontend
- **HTML5**: Semantic structure
- **JavaScript (Vanilla)**: Interactivity without dependencies

### Infrastructure
- **Docker**: Application containerization
- **Docker Compose**: Service orchestration
- **Volumes**: Data persistence

## Project Structure

```
pdashboard/
├── app.py                 # Main Flask application
├── requirements.txt      # Python dependencies
├── templates/            # HTML templates
│   └── carousel.html     # Single template for all pages
├── static/               # Static files
│   ├── css/
│   │   └── producao.css  # Page-specific CSS
│   └── js/
│       └── carousel.js   # Carousel JavaScript
├── pages/                # Modular pages
│   ├── producao/         # Production page
│   │   ├── config.json   # Page configuration
│   │   └── widgets.json  # Widget configuration
│   ├── previsoes/        # Forecasts page
│   │   └── config.json
│   ├── valores/          # Values page
│   │   └── config.json
│   └── performance/      # Performance page
│       └── config.json
├── data/                 # Excel data (Docker volume)
│   └── producao.xlsx     # Excel file with data
├── src/                  # Source files
├── docs/                 # Documentation
│   ├── dashboard_rules.md # Design rules
│   └── instructions.md   # This file
├── package.json          # Node.js configuration and scripts
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Container orchestration
└── README.md            # Main documentation
```

## Installation and Configuration

### Prerequisites
- Docker
- Docker Compose
- Node.js (for local development)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pdashboard
   ```

2. **Install Node.js dependencies (for CSS build)**
   ```bash
   npm install
   ```

3. **Run with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Access the system**
   - Dashboard: http://localhost:8000
   - API Docs: http://localhost:8000/api/v1/docs/

> **Note:** The system uses `.env.development` automatically for development.

## Auto-Reload Implementation

### How It Works
The system implements auto-reload through:

1. **Smart Polling**: Checks for configuration changes every 30 seconds
2. **Hash-based Detection**: Creates a hash of the configuration to detect changes
3. **Auto-refresh**: Automatically reloads when changes are detected

### Files Involved
- `static/js/carousel.js`: Change detection logic
- `templates/carousel.html`: Includes auto-reload script
- `app.py`: Endpoints for configuration verification

### Configuration
- **Check interval**: 30 seconds (configurable)
- **Detection**: Based on hash of page configuration
- **Trigger**: Any change in `config.json` or via API

### Technical Benefits
- **Lightweight**: Simple polling, no complex WebSockets
- **Reliable**: Works even with unstable connections
- **Scalable**: Works with multiple clients
- **Configurable**: Adjustable interval according to needs

### What Triggers Updates
- ✅ Activate/deactivate pages in admin panel
- ✅ Reorder pages via drag & drop
- ✅ Changes to `config.json` files
- ✅ Modifications via REST API
- ✅ Any change to page configuration

## Modular System

## Version Management and Changelog

### How to update the system version

1. **Update version:**
   - Execute: `make version-update VERSION=X.Y.Z`
   - Example: `make version-update VERSION=1.1.0`
   - This updates the `VERSION` file and propagates the version to frontend, API, admin, and Swagger.

2. **Update changelog:**
   - Edit the `CHANGELOG.md` file and add a new entry for the version.
   - Follow the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) pattern.

3. **Rebuild and deploy:**
   - Run `docker-compose build --no-cache && docker-compose up -d` to apply the new version.

4. **Verify:**
   - Use `make version` or access `/api/version` to check the active version.
   - The version will appear in admin, dashboard, API, and documentation.

### Useful commands
- `make version` — Shows current version
- `make version-info` — Shows version details
- `make version-update VERSION=X.Y.Z` — Updates version
- `make changelog` — Shows structured changelog

## Customization

### Logo Customization
The system includes placeholder logo files that can be customized:

#### Logo Files
- **Main Logo**: `static/assets/logo.png`
- **Secondary Logo**: `static/assets/getsitelogo.jpeg`

#### Customization Instructions
1. **Replace Placeholder Files**: The system includes text-based placeholder files with detailed instructions
2. **Upload Custom Logos**: Replace placeholder files with actual logo images
3. **Recommended Specifications**:
   - **Format**: PNG with transparency (main), JPEG or PNG (secondary)
   - **Size**: 200x80 pixels or similar aspect ratio
   - **Background**: Transparent for main logo
4. **Integration**: Logos automatically appear in dashboard and admin interfaces

#### Technical Details
- **Template Integration**: Logos are referenced in `templates/dashboard.html` and `templates/admin.html`
- **Static Assets**: Logos are served from `static/assets/` directory
- **Responsive Design**: Logos scale appropriately for different screen sizes

---

## Adding New Languages and Making Translations

PDashboard supports internationalization (i18n) and can be extended to support additional languages. Here’s how to add a new language and manage translations:

### 1. Locate the Translation Files
- Translations are typically stored in a Python dictionary or JSON file (e.g., `translations.py`, `translations.json`, or within `app.py`).
- Each language has its own dictionary of key-value pairs (e.g., `en`, `pt`).

### 2. Add a New Language
- Copy an existing language dictionary (e.g., English or Portuguese) as a template.
- Create a new entry for your target language (e.g., `es` for Spanish).
- Translate all values in the new dictionary to the target language.

**Example (Python):**
```python
translations = {
    'en': { 'dashboard': 'Dashboard', ... },
    'pt': { 'dashboard': 'Painel', ... },
    'es': { 'dashboard': 'Tablero', ... },  # New language
}
```

**Example (JSON):**
```json
{
  "en": { "dashboard": "Dashboard", ... },
  "pt": { "dashboard": "Painel", ... },
  "es": { "dashboard": "Tablero", ... }
}
```

### 3. Update the Language Selector
- If your UI has a language dropdown, add the new language option (e.g., "Español").
- Make sure the backend and frontend can recognize and load the new language code.

### 4. Test the Translations
- Switch to the new language in the UI and verify all texts are translated.
- Check for missing keys or untranslated strings.

### 5. Best Practices
- Keep translation keys consistent across all languages.
- Use clear, descriptive keys (e.g., `add_new_page`, `save`, `dashboard_title`).
- Regularly review and update translations as new features are added.
- Consider using translation management tools for larger projects.

---