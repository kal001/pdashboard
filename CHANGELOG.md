# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-07-12

### Added
- Text MD dashboards: display Markdown content as a dashboard page.
- Image dashboards: display a full-page image as a dashboard.
- Card type (2x2) dashboards.
- Graph dashboards: new 2x1-graph dashboard type supporting both bar and line widgets, with advanced visual features (value labels, vertical lines, area fill, label collision avoidance, edge detection, etc.).
- 2x2 dashboards: new grid layout for compact metric display.
- Multi-lingual site: full internationalization (i18n) for all UI, admin, and dashboard labels.
- Admin frontend: now supports uploading data files directly from the browser.
- Major UI/UX improvements for all dashboard types.
- Documentation updated for all new features and dashboard types.

## [1.1.0] - 2024-07-12

### Added
- Full internationalization (i18n) of the admin UI: all visible text, buttons, labels, and messages are now translatable and dynamically updated.
- Custom file input for uploads: fully translatable, modern UI, and displays selected file names/count.
- Support for multiple file selection and upload in a single operation from the admin panel.
- Backend `/api/data/upload` endpoint now supports multiple file uploads and returns per-file results.

### Changed
- All admin UI and file management actions now use the translation system.
- Improved error handling and user feedback for file uploads.

---

## [1.0.1] - 2024-07-12

### Changed
- Test version system

---

## [1.0.0] - 2024-07-11

### Added
- Initial release of PDashboard Modular System
- Dashboard carousel with 3x2 grid layout
- Modular page system with config.json files
- Admin panel for page management
- API REST with Swagger documentation
- Auto-reload functionality for real-time updates
- Docker support for development and production
- Excel data integration with pandas/openpyxl
- Health check endpoints
- Environment configuration (.env.development/.env.production)

### Features
- **Dashboard**: TV-optimized carousel with automatic rotation
- **Admin Panel**: Page activation/deactivation and reordering
- **API**: Complete REST API with interactive documentation
- **Auto-Reload**: Real-time updates across all connected clients
- **Modular Design**: Each page is independent with own configuration
- **Data Integration**: Excel file support for dynamic data
- **Responsive Design**: Optimized for TV displays

### Technical
- Flask backend with modular architecture
- File-based configuration system
- Docker containerization
- Environment-specific configurations
- Comprehensive documentation

---

## Versioning Guidelines

### Semantic Versioning (MAJOR.MINOR.PATCH)
- **MAJOR**: Breaking changes, incompatible API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### How to Update Version
1. Update `VERSION` file
2. Add entry to `CHANGELOG.md`
3. Update version in `app.py` (if needed)
4. Commit with message: `chore: bump version to X.Y.Z`

### Examples
- `1.0.1` - Bug fix release
- `1.1.0` - New feature release
- `2.0.0` - Breaking change release 