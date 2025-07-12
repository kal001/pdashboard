# User Manual (v1.2.0)

## What's New in 1.2.0
- Text MD dashboards: display Markdown content as a dashboard page
- Image dashboards: display a full-page image as a dashboard
- Graph dashboards: new 2x1-graph dashboard type (bar and line)
- 2x2 dashboards: new grid layout for compact metric display
- Multi-lingual site: full i18n for all UI, admin, and dashboard labels
- Admin frontend: upload data files directly from the browser
- Major UI/UX improvements for all dashboard types (value labels, vertical lines, area fills, label collision avoidance, edge detection, etc.)


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
     - **Type**: Select dashboard type (3x2, 2x2, 2x1-graph, text-md, or image)
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

The system supports four types of dashboards, each with different layouts and configuration options.

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

### 2x1-graph Dashboard (2 widgets)
**Layout**: 2 columns × 1 row grid, optimized for side-by-side graph widgets

**config.json Example**:
```json
{
  "id": "graph2x1",
  "title": "2x1 Graph Sample",
  "description": "Sample dashboard with two graph widgets side by side",
  "active": true,
  "type": "2x1-graph",
  "duration": 10,
  "template": "carousel.html",
  "css_file": "producao.css",
  "xlsx_file": "producao.xlsx",
  "widgets": [
    {
      "id": "graph1",
      "active": true,
      "name": "Graph Widget 1",
      "sheet": "ReceitasQ",
      "type": "bar",
      "column_month": "Mês",
      "column_bgt": "BGT",
      "column_real": "Real",
      "column_fct": "FCT"
    },
    {
      "id": "graph2",
      "active": true,
      "name": "Graph Widget 2",
      "sheet": "ReceitasM",
      "type": "bar",
      "column_month": "Mês",
      "column_bgt": "BGT",
      "column_real": "Real",
      "column_fct": "FCT"
    }
  ]
}
```

**Configuration Fields**: Same as 3x2, but `type` is "2x1-graph" and exactly 2 widgets. Each widget can specify custom column names for month, BGT, Real, and FCT data.

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

### Image Dashboard (Full-screen Image)
**Layout**: Full-screen image display, centered and proportionally scaled

**config.json Example**:
```json
{
  "id": "test",
  "title": "Test Page",
  "description": "Test page using sample image",
  "active": true,
  "type": "image",
  "duration": 10,
  "template": "carousel.html",
  "css_file": "producao.css",
  "image_file": "sample.jpg"
}
```

**Configuration Fields**:
- `id`, `title`, `description`, `active`, `duration`, `template`, `css_file`: Same as above
- `type`: Must be "image"
- `image_file`: Image file in `/data/` folder (supports .jpg, .png, .jpeg)

**Image Features**:
- Full-screen display with proper aspect ratio preservation
- Centered positioning with proportional scaling
- Supports common image formats (JPG, PNG, JPEG)
- Dark background for better image visibility
- Rounded corners for modern appearance

---

## 2x1-graph Dashboard Type

The `2x1-graph` dashboard type displays two large side-by-side widgets, each of which can be a bar or line chart. This layout is ideal for comparing two key metrics or trends in a visually prominent way.

### Configuration in `config.json`

To create a 2x1-graph dashboard, set the `type` field to `2x1-graph` in your page's `config.json`:

```json
{
  "id": "my_2x1_graph_page",
  "title": "Production vs. Budget",
  "type": "2x1-graph",
  "xlsx_file": "mydata.xlsx",
  "widgets": [
    { "id": "left", "name": "Graph Widget 1", "type": "bar", ... },
    { "id": "right", "name": "Graph Widget 2", "type": "line", ... }
  ]
}
```

### Widget Structure

Each widget in the `widgets` array can be either a `bar` or `line` type. The configuration for each type is as follows:

#### Bar Widget Example
```json
{
  "id": "left",
  "name": "Bar Widget",
  "type": "bar",
  "sheet": "Sheet1",
  "column_month": "Mês",
  "column_real": "Real",
  "column_fct": "FCT",
  "column_bgt": "BGT"
}
```

#### Line Widget Example
```json
{
  "id": "right",
  "name": "Line Widget",
  "type": "line",
  "sheet": "Sheet1",
  "column_month": "Mês",
  "column_real": "Real",
  "column_fct": "FCT",
  "column_bgt": "BGT"
}
```

### Excel Data Requirements
- **Bar and Line widgets** both require columns for:
  - `Mês` (Month/Category)
  - `Real` (Actual)
  - `FCT` (Forecast)
  - `BGT` (Budget)
- The system will automatically use Real values where available, and switch to FCT values when Real is missing, for the Real/FCT series.

### Visual Features
- **Bar Chart:**
  - Real and FCT bars are visually distinct (solid/dotted border, color-coded)
  - BGT bars are always solid
  - Value labels above each bar, color-coded by performance
  - Vertical lines for visual alignment
- **Line Chart:**
  - Real/FCT line is solid for Real, dotted for FCT
  - BGT line is always solid
  - Value labels above (Real/FCT) and below (BGT) each point, with automatic collision avoidance and edge detection
  - Vertical lines from each point to the x-axis
  - Subtle area fill under the BGT line for emphasis

### Example `config.json` for a 2x1-graph Page
```json
{
  "id": "production_vs_budget",
  "title": "Production vs. Budget",
  "type": "2x1-graph",
  "xlsx_file": "production_data.xlsx",
  "widgets": [
    {
      "id": "prod_bar",
      "name": "Production (Bar)",
      "type": "bar",
      "sheet": "Sheet1",
      "column_month": "Mês",
      "column_real": "Real",
      "column_fct": "FCT",
      "column_bgt": "BGT"
    },
    {
      "id": "prod_line",
      "name": "Production (Line)",
      "type": "line",
      "sheet": "Sheet1",
      "column_month": "Mês",
      "column_real": "Real",
      "column_fct": "FCT",
      "column_bgt": "BGT"
    }
  ]
}
```

### Special Notes
- Value formatting, color, and label collision avoidance are handled automatically for both chart types.
- The 2x1-graph dashboard is ideal for high-visibility, side-by-side metric comparison.
- All features are internationalized and visually consistent with other dashboard types.

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
  - Dashboard type (3x2, 2x2, 2x1-graph, text-md, image)
  - Active status
  - Data file name (Excel file for 3x2/2x2/2x1-graph, Markdown file for text-md, Image file for image)
  - Active widgets count (for 3x2/2x2/2x1-graph types)

#### Reordering Pages
- **Drag & Drop**: Click and drag page cards to change their order
- **Carousel Order**: The order determines the sequence in the dashboard carousel
- **Auto-Save**: Changes are saved automatically

#### Page Configuration Details
- **Template**: HTML template used (usually "carousel.html")
- **CSS File**: Custom styling applied to the page
- **Duration**: Time the page stays visible in the carousel
- **Widgets**: For 3x2/2x2/2x1-graph types, shows active widget count
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
- **View Types**: See all available dashboard types (3x2, 2x2, 2x1-graph, text-md, image)
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
- **Widget Limits**: Respect the widget limits (6 for 3x2, 4 for 2x2, 2 for 2x1-graph)
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
| image | Full screen | None | Image file | Image display |

### Common Configuration Fields
| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `id` | Yes | Unique identifier | "producao3" |
| `title` | Yes | Display name | "Produção Linha 3" |
| `type` | Yes | Dashboard type | "3x2", "2x2", "2x1-graph", "text-md", "image" |
| `active` | No | Visibility status | true/false |
| `duration` | No | Carousel time (seconds) | 10 |
| `template` | No | HTML template | "carousel.html" |
| `css_file` | No | Custom CSS | "producao.css" |
| `xlsx_file` | No* | Excel data file | "producao.xlsx" |
| `md_file` | No* | Markdown file | "sample.md" |
| `image_file` | No* | Image file | "sample.jpg" |

### File Types Supported
- **Data Files**: `.xlsx`, `.xls`, `.csv`
- **Content Files**: `.md`, `.txt`
- **Image Files**: `.jpg`, `.png`, `.jpeg`

### Number Formatting for Dashboard Values

All values shown in dashboards (3x2 and 2x1-graph) are formatted according to the `number_format` field in `/pages/config.json`.

- **Field:** `number_format`
- **Example:**
  ```json
  "number_format": " # ###"
  ```
- **Description:**
  - Controls how numbers are displayed (e.g., space as thousands separator).
  - Applies to all value labels, targets, and chart values in dashboards.
  - To change the format, edit `/pages/config.json` and set the desired pattern.

**Supported patterns:**
- `# ###` (space as thousands separator)
- `#,###` (comma as thousands separator)
- `#.###` (dot as thousands separator)

**Example config.json:**
```json
{
  "company_name": "Name of the Company",
  "number_format": " # ###",
  ...
}
```

## Customization

### Logo Customization
The dashboard displays two logos in the header that can be customized:

#### Logo Files Location
- **Main Logo**: `static/assets/logo.png`
- **Secondary Logo**: `static/assets/getsitelogo.jpeg`

#### Customization Steps
1. **Replace Placeholder Files**: The system includes placeholder files with instructions
2. **Upload Your Logos**: Replace the placeholder files with your actual logo images
3. **Recommended Specifications**:
   - **Format**: PNG with transparency (main logo), JPEG or PNG (secondary logo)
   - **Size**: 200x80 pixels or similar aspect ratio
   - **Background**: Transparent for main logo, white or transparent for secondary
4. **Automatic Display**: Logos will appear in dashboard header and admin panel

#### Logo Usage
- **Dashboard Header**: Both logos are displayed in the top-left corner
- **Admin Panel**: Main logo appears in the admin interface header
- **Responsive Design**: Logos scale appropriately for different screen sizes

---

## 7. Customizing Colors and Text Sizes (Header, Footer, and Dashboards)

You can personalize the look and feel of your dashboards by changing colors and text sizes for the header, footer, and each dashboard type.

### 1. Customizing Header and Footer (Global)

The main styles for the header and footer are defined in these CSS files:
- **Dashboard pages:** `static/css/dashboard.css`
- **Admin panel:** `static/css/admin.css`
- **Production dashboards:** `static/css/producao.css` (if used)

#### Common Customizations
- **Header background color:**
  - In `dashboard.css`, find `.dashboard-header` and change the `background` property.
- **Footer background color:**
  - In `dashboard.css`, find `.dashboard-footer` or the relevant footer class.
- **Header/footer text color:**
  - Change the `color` property in the same classes.
- **Header height and padding:**
  - Adjust the CSS variables at the top of the file (e.g., `--header-height`, `--header-padding`).
- **Logo size:**
  - Change `--logo-height` and `--logo-margin` variables.
- **Text sizes:**
  - Header month: `.header-info .company-name` (font-size)
  - Company name: `.company-name` (font-size)
  - Subtitle: `.header-subtitle` (font-size)

#### Example: Change Header Background and Month Size
```css
:root {
    --header-height: 120px;
    --header-padding: 30px 40px;
    --logo-height: 60px;
    --logo-margin: 20px;
}
.dashboard-header {
    background: linear-gradient(135deg, #123456 0%, #234567 100%); /* Custom gradient */
}
.header-info .company-name {
    font-size: 2.5rem; /* Change month size */
}
```

### 2. Customizing Each Dashboard Type (Per Page or Per Type)

Each dashboard page can use its own CSS file for full control over colors and text sizes. This is set in the page's `config.json`:

```json
{
  "css_file": "producao.css"
}
```

- Place your custom CSS file in `static/css/`.
- Reference it in the `css_file` field of the page's `config.json`.
- The system will load this CSS for that page only.

#### What You Can Customize
- **Widget backgrounds:** Change the background color for widget cards (e.g., `.widget-card` or inline style)
- **Widget text color and size:** Adjust `.widget-title`, `.widget-value`, `.widget-label`, etc.
- **Markdown/text dashboards:** Use the `font_size` field in `config.json` for text-md dashboards (e.g., `"font_size": "2.2rem"`).

#### Example: Custom Widget Card Color and Font Size
```css
.widget-card {
    background: #222a36;
    border-radius: 1.25rem;
}
.widget-title {
    font-size: 2.5rem;
    color: #fff;
}
```

#### Example: Customizing Text Size for Markdown Dashboard
In `config.json`:
```json
{
  "type": "text-md",
  "font_size": "2.5rem"
}
```

### 3. Tips
- Use browser developer tools (F12) to inspect elements and test style changes live.
- After editing CSS files, refresh the dashboard page to see changes.
- For global changes, edit `dashboard.css`. For per-page changes, create and reference a custom CSS file.
- You can copy and modify any of the provided CSS files as a starting point.

---

*For technical support and advanced configuration, refer to the administrator documentation or contact your system administrator.* 