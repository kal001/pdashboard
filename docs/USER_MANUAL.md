# PDashboard User Manual

## Table of Contents
1. [Adding New Pages](#1-adding-new-pages)
2. [Dashboard Types & Configuration](#2-dashboard-types--configuration)
3. [Using the Admin UI](#3-using-the-admin-ui)
4. [Managing Global Configuration](#4-managing-global-configuration)
5. [Best Practices](#5-best-practices)
6. [API and Documentation](#6-api-and-documentation)

---

## 1. Adding New Pages

### Via Admin UI (Recommended)
1. **Access the Admin Panel**
   - Go to: `http://<server-ip>:8000/admin`
   - The admin panel is fully internationalized (Portuguese/English)

2. **Create a New Page**
   - Click the **"Add New Page"** button
   - Fill in the form with the following details:
     - **Folder Name**: Unique directory name (e.g., `producao4`)
     - **ID**: Unique page identifier (e.g., `producao4`)
     - **Title**: Display name shown in the dashboard
     - **Description**: Optional description of the page
     - **Active**: Check to make the page visible in the carousel
     - **Type**: Select dashboard type (3x2, 2x2, or text-md)
     - **Duration**: Time in seconds the page stays in the carousel
     - **Template**: Usually `carousel.html`
     - **CSS File**: Custom styling file (optional)
     - **Excel File**: Data file for 3x2/2x2 types
     - **Markdown File**: Content file for text-md type
   - Click **"Create Page"**
   - The page will be created in `pages/<folder_name>/config.json`

### Manual Creation
1. Create a new folder in `pages/` (e.g., `pages/producao4/`)
2. Add a `config.json` file with the appropriate structure (see section 2)
3. The system will automatically detect and register the new page

---

## 2. Dashboard Types & Configuration

The system supports three types of dashboards, each with different layouts and configuration options.

### 3x2 Dashboard (6 widgets)
**Layout**: 3 columns × 2 rows grid, optimized for TV displays

**config.json Example**:
```json
{
  "id": "producao3",
  "title": "Produção Linha 3",
  "description": "Dashboard de produção da linha 3",
  "active": true,
  "type": "3x2",
  "duration": 10,
  "template": "carousel.html",
  "css_file": "producao.css",
  "xlsx_file": "producao.xlsx",
  "widgets": [
    {
      "id": "widget1",
      "active": true,
      "name": "Linha 3 - Equipamento A",
      "sheet": "ModeloA"
    },
    {
      "id": "widget2",
      "active": true,
      "name": "Linha 3 - Equipamento B",
      "sheet": "ModeloB"
    }
  ]
}
```

**Configuration Fields**:
- `id`: Unique page identifier
- `title`: Display name
- `description`: Optional description
- `active`: Whether the page is visible
- `type`: Must be "3x2"
- `duration`: Seconds in carousel rotation
- `template`: HTML template (usually "carousel.html")
- `css_file`: Custom CSS file (optional)
- `xlsx_file`: Excel data file in `/data/` folder
- `widgets`: Array of up to 6 widget configurations

### 2x2 Dashboard (4 widgets)
**Layout**: 2 columns × 2 rows grid, more compact layout

**config.json Example**:
```json
{
  "id": "producao2",
  "title": "Produção Linha 2",
  "description": "Dashboard compacto da linha 2",
  "active": true,
  "type": "2x2",
  "duration": 8,
  "template": "carousel.html",
  "css_file": "producao.css",
  "xlsx_file": "producao2.xlsx",
  "widgets": [
    {
      "id": "widget1",
      "active": true,
      "name": "Linha 2 - Equipamento A",
      "sheet": "ModeloA"
    },
    {
      "id": "widget2",
      "active": true,
      "name": "Linha 2 - Equipamento B",
      "sheet": "ModeloB"
    }
  ]
}
```

**Configuration Fields**: Same as 3x2, but `type` is "2x2" and up to 4 widgets

### Text MD Dashboard (Markdown)
**Layout**: Full-screen text display with Markdown formatting

**config.json Example**:
```json
{
  "id": "testemd",
  "title": "Página Markdown",
  "description": "Exemplo de dashboard em Markdown",
  "active": true,
  "type": "text-md",
  "duration": 15,
  "template": "carousel.html",
  "css_file": "producao.css",
  "md_file": "sample.md",
  "font_size": "2.2rem"
}
```

**Configuration Fields**:
- `id`, `title`, `description`, `active`, `duration`, `template`, `css_file`: Same as above
- `type`: Must be "text-md"
- `md_file`: Markdown file in `/data/` folder
- `font_size`: Text size (e.g., "2.2rem", "40px", "3rem")

**Markdown Features**:
- Supports all standard Markdown syntax
- Tables, lists, headings, links, images
- Blockquotes and code blocks
- Custom styling for better readability

---

## 3. Using the Admin UI

### File Upload Management

#### Uploading Data Files
1. **Access File Upload Section**
   - In the admin panel, scroll to the **"Data Management"** section

2. **Select Files**
   - Click **"Select file(s)"** button
   - Choose one or more files:
     - Excel files (`.xlsx`, `.xls`)
     - CSV files (`.csv`)
     - Images (`.jpg`, `.png`, `.jpeg`)
     - Text files (`.txt`)
     - Markdown files (`.md`)

3. **Upload Files**
   - Selected files will show their names (or count if multiple)
   - Click **"Upload"** to send files to the server
   - Files are saved in the `/data/` folder

#### Managing Uploaded Files
- **View Files**: All uploaded files are listed in the **"Files in data/"** section
- **Delete Files**: Click the **"Delete"** button next to any file
- **File Status**: The system shows upload status and any errors

### Page Management

#### Activating/Deactivating Pages
1. **View Pages**: All pages are listed in the **"Dashboard Pages Management"** section
2. **Toggle Status**: Each page card has an **Active/Inactive** toggle button
3. **Apply Changes**: Click the toggle to activate or deactivate a page
   - Active pages appear in the dashboard carousel
   - Inactive pages are hidden but not deleted

#### Viewing Page Configuration
- **Page Cards**: Each page shows:
  - Page title and description
  - Dashboard type (3x2, 2x2, text-md)
  - Active status
  - Data file name (Excel file for 3x2/2x2, Markdown file for text-md)
  - Active widgets count (for 3x2/2x2 types)

#### Reordering Pages
- **Drag & Drop**: Click and drag page cards to change their order
- **Carousel Order**: The order determines the sequence in the dashboard carousel
- **Auto-Save**: Changes are saved automatically

#### Page Configuration Details
- **Template**: HTML template used (usually "carousel.html")
- **CSS File**: Custom styling applied to the page
- **Duration**: Time the page stays visible in the carousel
- **Widgets**: For 3x2/2x2 types, shows active widget count
- **Data Files**: Shows which Excel or Markdown file provides the data

---

## 4. Managing Global Configuration

The **Global Configuration** section (at the top of the admin panel) controls system-wide settings.

### Company Information
- **Company Name**: Displayed in the dashboard header
- **Last Update Month**: Shown prominently in the dashboard header

### Language Settings
- **Language Selection**: Choose between Portuguese and English
- **Dynamic Translation**: All UI elements update immediately when language changes
- **Persistent**: Language choice is saved and remembered

### Dashboard Types Management
- **View Types**: See all available dashboard types (3x2, 2x2, text-md)
- **Add New Type**: Enter a new type name and click **"Add"**
- **Remove Types**: Click the × button next to any type
- **Type Usage**: New types become available when creating pages

### Saving Configuration
1. **Make Changes**: Edit any of the global settings
2. **Save**: Click the **"Save"** button
3. **Auto-Reload**: The system automatically reloads with new settings
4. **Confirmation**: A success message confirms the save

---

## 5. Best Practices

### Page Creation
- **Use Clear Names**: Choose descriptive folder names and IDs
- **Test First**: Create and test pages in development before production
- **Backup Configurations**: Keep backups of important `config.json` files
- **Consistent Naming**: Use consistent naming conventions across pages

### Data Management
- **File Organization**: Keep data files organized in the `/data/` folder
- **Regular Updates**: Upload new data files regularly to keep dashboards current
- **File Validation**: Ensure Excel files have the correct sheet names and structure
- **Backup Data**: Regularly backup important data files

### Dashboard Design
- **Widget Limits**: Respect the widget limits (6 for 3x2, 4 for 2x2)
- **Duration Balance**: Set appropriate durations for each page type
- **CSS Customization**: Use custom CSS files for page-specific styling
- **Content Quality**: For text-md pages, ensure Markdown content is well-formatted

### System Maintenance
- **Regular Backups**: Backup both `pages/` and `data/` folders
- **Monitor Performance**: Check system performance with multiple active pages
- **Update Regularly**: Keep the system updated with the latest version
- **Test Changes**: Always test configuration changes before applying to production

---

## 6. API and Documentation

### Interactive API Documentation
- **Swagger UI**: `http://<server-ip>:8000/api/v1/docs/`
- **Explore Endpoints**: Test all API endpoints directly in the browser
- **Request/Response Examples**: See detailed examples for each endpoint

### Key API Endpoints
- **GET /api/pages**: List all pages and their configurations
- **POST /api/pages/create**: Create a new page
- **POST /api/pages/{id}/toggle**: Activate/deactivate a page
- **POST /api/pages/reorder**: Change page order
- **GET /api/data**: Get dashboard data
- **POST /api/data/upload**: Upload data files
- **GET /api/config**: Get system configuration
- **POST /api/config/update**: Update global configuration

### Automation and Integration
- **REST API**: All admin functions are available via API
- **JSON Format**: All data is exchanged in JSON format
- **Authentication**: API endpoints are available for integration
- **Real-time Updates**: API supports real-time configuration changes

### Additional Documentation
- **Admin Manual**: `docs/ADMIN.md` - Detailed administrator guide
- **API Documentation**: `docs/API.md` - Complete API reference
- **Deployment Guide**: `docs/DEPLOYMENT.md` - Production deployment instructions
- **Technical Instructions**: `docs/instructions.md` - Implementation details

---

## Quick Reference

### Dashboard Types Summary
| Type | Layout | Widgets | Data Source | Use Case |
|------|--------|---------|-------------|----------|
| 3x2 | 3×2 grid | Up to 6 | Excel file | Production monitoring |
| 2x2 | 2×2 grid | Up to 4 | Excel file | Compact dashboards |
| text-md | Full screen | None | Markdown file | Information display |

### Common Configuration Fields
| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `id` | Yes | Unique identifier | "producao3" |
| `title` | Yes | Display name | "Produção Linha 3" |
| `type` | Yes | Dashboard type | "3x2", "2x2", "text-md" |
| `active` | No | Visibility status | true/false |
| `duration` | No | Carousel time (seconds) | 10 |
| `template` | No | HTML template | "carousel.html" |
| `css_file` | No | Custom CSS | "producao.css" |

### File Types Supported
- **Data Files**: `.xlsx`, `.xls`, `.csv`
- **Content Files**: `.md`, `.txt`
- **Image Files**: `.jpg`, `.png`, `.jpeg`

---

*For technical support and advanced configuration, refer to the administrator documentation or contact your system administrator.* 