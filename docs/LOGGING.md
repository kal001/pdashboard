# Logging Configuration

## Overview

PDashboard implements comprehensive logging for both development and production environments. The logging system provides:

- **Application logs**: Page registration, configuration changes, errors
- **Request logs**: HTTP requests and responses via Werkzeug
- **Log rotation**: Automatic log file rotation to prevent disk space issues
- **Environment-specific levels**: DEBUG for development, INFO for production

## Log Files

### Location
- **Development**: `./logs/pdashboard.log` (mounted from container)
- **Production**: `/app/logs/pdashboard.log` (inside container, persisted via volume)

### Log Format
```
2025-07-12 17:24:52,812 - app - INFO - Starting PDashboard application
2025-07-12 17:24:52,816 - app - INFO - Starting server on 0.0.0.0:5000 (debug=True)
2025-07-12 17:24:52,820 - werkzeug - INFO - 192.168.65.1 - - [12/Jul/2025 17:24:52] "GET /api/events HTTP/1.1" 200 -
```

## Configuration

### Development Environment
- **Log Level**: DEBUG
- **Rotation**: 10MB files, 5 backups
- **Location**: `./logs/pdashboard.log`

### Production Environment
- **Log Level**: INFO
- **Rotation**: 10MB files, 5 backups (application) + daily rotation (system)
- **Location**: `/app/logs/pdashboard.log`
- **System Rotation**: Daily rotation with 30 days retention

## Log Levels

- **DEBUG**: Detailed information for debugging
- **INFO**: General application information
- **WARNING**: Warning messages for potential issues
- **ERROR**: Error messages for actual problems

## What Gets Logged

### Application Events
- Application startup and configuration
- Page registration and discovery
- Configuration changes (page toggles, reordering)
- Database operations
- File uploads and deletions

### Request Logging
- All HTTP requests and responses
- Request timing and status codes
- Client IP addresses

### Error Logging
- Configuration file errors
- Database connection issues
- File system errors
- API endpoint errors

## Production Setup

### Docker Compose
The production `docker-compose.prod.yml` includes:
```yaml
volumes:
  - ./logs:/app/logs  # Persist logs on host
```

### Log Rotation
Production uses two levels of log rotation:

1. **Application-level**: Python's RotatingFileHandler
   - 10MB per file
   - 5 backup files
   - Automatic rotation when size limit reached

2. **System-level**: logrotate (Linux)
   - Daily rotation
   - 30 days retention
   - Compression of old logs

### Logrotate Configuration
```bash
# Install logrotate configuration
sudo cp logrotate.conf /etc/logrotate.d/pdashboard

# Test configuration
sudo logrotate -d /etc/logrotate.d/pdashboard
```

## Monitoring and Maintenance

### Viewing Logs
```bash
# Development
tail -f logs/pdashboard.log

# Production (inside container)
docker-compose -f docker-compose.prod.yml exec dashboard tail -f /app/logs/pdashboard.log

# Production (from host)
tail -f logs/pdashboard.log
```

### Log Analysis
```bash
# Count log entries by level
grep "ERROR" logs/pdashboard.log | wc -l
grep "WARNING" logs/pdashboard.log | wc -l

# Find recent errors
tail -100 logs/pdashboard.log | grep "ERROR"

# Monitor specific page operations
grep "page.*config" logs/pdashboard.log
```

### Log Cleanup
```bash
# Manual cleanup (if needed)
find logs/ -name "*.log.*" -mtime +30 -delete
```

## Troubleshooting

### Common Issues

1. **No logs appearing**
   - Check if logs directory exists
   - Verify volume mapping in docker-compose
   - Check file permissions

2. **Log rotation not working**
   - Verify logrotate is installed in production container
   - Check logrotate configuration syntax
   - Ensure sufficient disk space

3. **High log volume**
   - Adjust log levels (DEBUG → INFO)
   - Reduce rotation frequency
   - Implement log filtering

### Debug Commands
```bash
# Check log file size
ls -lh logs/pdashboard.log

# Check logrotate status
sudo logrotate -d /etc/logrotate.d/pdashboard

# Test logging from application
docker-compose exec dashboard python -c "from app import setup_logging; logger = setup_logging(); logger.info('Test message')"
```

## Security Considerations

- Log files may contain sensitive information
- Ensure proper file permissions (644)
- Consider log encryption for highly sensitive environments
- Implement log retention policies
- Monitor log file access

## Performance Impact

- Logging adds minimal overhead (< 1% CPU)
- File I/O is buffered for performance
- Log rotation happens asynchronously
- Production uses INFO level to reduce verbosity 