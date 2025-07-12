# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Tailwind CSS v4 integration
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