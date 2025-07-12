#!/usr/bin/env python3
"""
Version management utility for PDashboard
"""

import os
import json
from datetime import datetime

def get_version():
    """Read version from VERSION file"""
    try:
        with open('VERSION', 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return "0.0.0"

def get_global_config():
    """Read global configuration from pages/config.json"""
    global_config_path = os.path.join('pages', 'config.json')
    config = {
        'company_name': 'Company Name',  # Default fallback
        'last_update_month': ''
    }
    
    if os.path.exists(global_config_path):
        try:
            with open(global_config_path, 'r', encoding='utf-8') as f:
                file_config = json.load(f)
                config.update(file_config)
        except Exception as e:
            print(f"Error loading global config: {e}")
    
    return config

def get_version_info():
    """Get comprehensive version information"""
    version = get_version()
    global_config = get_global_config()
    
    return {
        'version': version,
        'build_date': datetime.now().isoformat(),
        'app_name': 'PDashboard',
        'description': 'Dashboard Fabril Modular',
        'company': global_config.get('company_name', 'Company Name')
    }

def update_version(new_version):
    """Update version in VERSION file"""
    with open('VERSION', 'w') as f:
        f.write(new_version)
    print(f"Version updated to {new_version}")

def get_changelog_entries():
    """Parse CHANGELOG.md and return structured data"""
    try:
        with open('CHANGELOG.md', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Simple parsing - you might want to use a markdown parser
        versions = []
        lines = content.split('\n')
        current_version = None
        current_section = None
        
        for line in lines:
            if line.startswith('## ['):
                # New version entry
                version_match = line.split('[')[1].split(']')[0]
                current_version = {
                    'version': version_match,
                    'sections': {}
                }
                versions.append(current_version)
            elif line.startswith('### ') and current_version:
                # New section
                current_section = line.replace('### ', '').strip()
                current_version['sections'][current_section] = []
            elif line.startswith('- ') and current_version and current_section:
                # Item in section
                item = line.replace('- ', '').strip()
                current_version['sections'][current_section].append(item)
        
        return versions
    except FileNotFoundError:
        return []

if __name__ == "__main__":
    # Command line interface
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "get":
            print(get_version())
        elif command == "info":
            print(json.dumps(get_version_info(), indent=2))
        elif command == "update" and len(sys.argv) > 2:
            update_version(sys.argv[2])
        elif command == "changelog":
            entries = get_changelog_entries()
            print(json.dumps(entries, indent=2))
        else:
            print("Usage:")
            print("  python utils/version.py get")
            print("  python utils/version.py info")
            print("  python utils/version.py update <version>")
            print("  python utils/version.py changelog")
    else:
        print(f"Current version: {get_version()}") 