# Administrator Manual - Modular Dashboard

## Supported Dashboard Types

### 3x2 (6 widgets)
- 3x2 grid layout (3 columns, 2 rows), up to 6 widgets.
- Main fields in config.json:
  - `type`: "3x2"
  - `widgets`: array of up to 6 widgets
  - `xlsx_file`: Excel file name in `/data/` with the data
  - `template`, `css_file`, etc.

### 2x2 (4 widgets)
- 2x2 grid layout (2 columns, 2 rows), up to 4 widgets.
- Main fields in config.json:
  - `type`: "2x2"
  - `widgets`: array of up to 4 widgets
  - `xlsx_file`: Excel file name in `/data/` with the data
  - `template`, `css_file`, etc.

### Text MD (Markdown)
- Uses the entire dashboard area to display formatted Markdown text.
- No widgets.
- Main fields in config.json:
  - `type`: "text-md"
  - `md_file`: Markdown file name in `/data/` (e.g., `sample.md`)
  - `font_size`: font size (e.g., "2.2rem", "40px", etc.)
  - `template`, `css_file`, etc.
- Supports all standard Markdown features (tables, lists, quotes, links, etc.).
- The file can be edited and re-uploaded via admin.

---

## New Features in Version 1.1.0

### Internationalization (i18n)
- The entire admin panel is now available in Portuguese and English.
- Use the language selector at the top of the panel to instantly switch between languages.
- All texts, buttons, messages, and placeholders are dynamically translated.

### Multiple File Upload
- The data upload form now allows selecting and sending multiple files at once.
- Click "Select files" to choose multiple files (Ctrl/Cmd + click or Shift + click).
- The selected file names (or count) appear next to the button.
- Click "Upload" to send all files at once.
- The backend saves all valid files and returns success/error messages for each one.

### Custom File Input
- The upload button has been modernized: user-friendly interface, fully translatable and consistent with the selected language.
- The button text and status messages change according to the language.

---

## Accessing the Admin Panel
- Access: `http://<server-ip>:8000/admin`
- The panel shows all configured pages

## API and Documentation
- **Interactive Documentation:** `http://<server-ip>:8000/api/v1/docs/`
- **REST API:** All endpoints for programmatic management
- **Swagger UI:** Test endpoints directly in the browser

## Client Auto-Reload

The system includes auto-reload functionality that automatically updates all connected dashboards when configuration changes occur:

### How It Works
- **Automatic Detection:** The dashboard checks for configuration changes every 30 seconds
- **Instant Update:** When changes are detected, it automatically reloads the page
- **No Manual Intervention:** No need to manually refresh client browsers

### What Triggers Auto-Reload
- ✅ **Activate/Deactivate pages** (via admin panel or API)
- ✅ **Reorder pages** (via drag & drop in admin)
- ✅ **Changes to config.json files**
- ✅ **Any change to page configuration**

### Benefits
- **Automatic Synchronization:** All displays always show the most recent configuration
- **Zero Downtime:** Updates without interrupting the display
- **Multi-Client:** Works with multiple browsers/displays simultaneously

## Activating/Deactivating Pages
- Use the "Active/Inactive" button on each page card
- Inactive pages don't appear in the dashboard
- **Via API:** POST `/api/v1/pages/{page_id}/toggle`

## Reordering Pages
- Drag and drop cards to change the order
- The order defines the sequence in the carousel
- **Via API:** POST `/api/v1/pages/reorder`

## Editing Pages (config.json)
- Each page has a `config.json` file in `pages/<name>/`
- **💡 Reminder:** To see the current file structure, check `/pages/config.json` in the admin panel
- Edit the fields:
  - `id`: unique identifier
  - `title`: display name
  - `type`: currently "3x2", "2x2", or "text-md"
  - `template`: HTML template used (e.g., carousel.html)
  - `css_file`: specific CSS (optional)
  - `widgets`: array of active widgets

### config.json Example
```json
{
  "id": "producao3",
  "title": "Production Line 3",
  "type": "3x2",
  "template": "carousel.html",
  "css_file": "producao.css",
  "widgets": [
    { "id": "widget1", "active": true, "name": "Line 3 - Equipment A", "sheet": "ModelA" },
    { "id": "widget2", "active": true, "name": "Line 3 - Equipment B", "sheet": "ModelB" }
  ]
}
```

- To add widgets, include new objects in the `widgets` array.
- The `active` field controls whether the widget appears.

## Best Practices
- Always backup `pages/` and `data/` before major changes
- Use clear names for pages and widgets
- Test changes in a development environment before applying to production
- Use the API for automation and integration with other systems

## Extensibility
- The system accepts new page types in the future (e.g., "2x2", "full", etc.). See documentation for new type patterns.

## Customization

### Logo Customization
The system displays two logos that can be customized:

#### Logo Files
- **Main Logo**: `static/assets/logo.png` - Used in dashboard header and admin panel
- **Secondary Logo**: `static/assets/getsitelogo.jpeg` - Displayed alongside main logo

#### Customization Process
1. **Replace Placeholder Files**: The system includes placeholder files with detailed instructions
2. **Upload Custom Logos**: Replace placeholder files with your actual logo images
3. **Recommended Specifications**:
   - **Main Logo**: PNG format with transparency, 200x80 pixels
   - **Secondary Logo**: JPEG or PNG format, 200x80 pixels
4. **Automatic Integration**: Logos will automatically appear in all interfaces

#### Logo Display
- **Dashboard**: Both logos shown in header top-left corner
- **Admin Panel**: Main logo displayed in admin header
- **Responsive**: Logos scale appropriately for different screen sizes 

---

## Customizing Colors and Text Sizes (Header, Footer, and Dashboards)

The PDashboard system is highly customizable. You can change the colors and text sizes for the header, footer, and each dashboard type to match your branding or display needs.

### 1. Customizing Header and Footer (Global)

The main styles for the header and footer are defined in the following CSS files:
- **Dashboard pages:** `static/css/dashboard.css`
- **Admin panel:** `static/css/admin.css`
- **Production dashboards:** `static/css/producao.css` (if used)

#### Common Customizations
- **Header background color:**
  - In `dashboard.css`, look for `.dashboard-header` and change the `background` property.
- **Footer background color:**
  - In `dashboard.css`, look for `.dashboard-footer` or the relevant footer class.
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