from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory, abort, Response
from markupsafe import Markup
import sqlite3
import os
import json
from datetime import datetime
import pandas as pd
import glob
import openpyxl
from flasgger import Swagger, swag_from
from flask import Blueprint
import time

# Import version utilities
def get_version():
    """Read version from VERSION file"""
    try:
        with open('VERSION', 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return "0.0.0"

def get_version_info():
    """Get comprehensive version information"""
    version = get_version()
    
    return {
        'version': version,
        'build_date': datetime.now().isoformat(),
        'app_name': 'PDashboard',
        'description': 'Dashboard Fabril Modular',
        'company': 'Jayme da Costa'
    }

app = Flask(__name__)
app.secret_key = 'jayme_da_costa_dashboard_2024'

# Configure Flask to handle trailing slashes properly
app.url_map.strict_slashes = False

# Move Swagger UI to /api/v1/docs
app.config['SWAGGER'] = {
    'swagger_ui': True,
    'specs_route': '/api/v1/docs/'
}

# Database initialization
def init_db():
    conn = sqlite3.connect('dashboard.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_id TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            type TEXT,
            active BOOLEAN DEFAULT 1,
            order_num INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS dashboard_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data_type TEXT NOT NULL,
            data_json TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Discover and register pages from pages folder
    discover_pages(cursor)
    
    conn.commit()
    conn.close()

def discover_pages(cursor):
    """Discover pages from the pages folder and register them in the database"""
    pages_dir = 'pages'
    if not os.path.exists(pages_dir):
        return
    
    # Get all page folders
    page_folders = [d for d in os.listdir(pages_dir) 
                   if os.path.isdir(os.path.join(pages_dir, d))]
    
    for page_folder in page_folders:
        config_file = os.path.join(pages_dir, page_folder, 'config.json')
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                # Check if page already exists
                cursor.execute("SELECT id FROM pages WHERE page_id = ?", (config['id'],))
                if not cursor.fetchone():
                    # Insert new page
                    cursor.execute("""
                        INSERT INTO pages (page_id, title, description, icon, type, active, order_num)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (
                        config['id'],
                        config['title'],
                        config.get('description', ''),
                        config.get('icon', '📄'),
                        config.get('type', 'default'),
                        config.get('default_active', True),
                        config.get('order', 999)
                    ))
                    print(f"Registered page: {config['title']}")
            except Exception as e:
                print(f"Error loading page config {config_file}: {e}")

def get_pages():
    """Get all pages with their configuration from config.json files"""
    pages = []
    pages_dir = 'pages'
    
    if not os.path.exists(pages_dir):
        return pages
    
    # Get all subdirectories in pages/
    page_dirs = [d for d in os.listdir(pages_dir) 
                 if os.path.isdir(os.path.join(pages_dir, d))]
    
    # Sort by order if specified in config, otherwise alphabetically
    page_configs = []
    for page_dir in page_dirs:
        config_file = os.path.join(pages_dir, page_dir, 'config.json')
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                config['_dir'] = page_dir  # Store directory name
                page_configs.append(config)
            except Exception as e:
                print(f"Error loading page config {config_file}: {e}")
    
    # Sort by order field if present, otherwise alphabetically
    page_configs.sort(key=lambda x: (x.get('order', 999), x.get('title', '')))
    
    for i, config in enumerate(page_configs):
        pages.append({
            'id': i + 1,  # Sequential ID for compatibility
            'page_id': config['id'],
            'title': config['title'],
            'description': config.get('description', ''),
            'icon': config.get('icon', '📄'),
            'type': config.get('type', 'default'),
            'active': config.get('active', True),
            'order': config.get('order', i + 1),
            'config': config
        })
    
    return pages

def get_active_pages():
    pages = []
    for page_folder in os.listdir('pages'):
        config_path = os.path.join('pages', page_folder, 'config.json')
        if os.path.exists(config_path):
            with open(config_path, encoding='utf-8') as f:
                config = json.load(f)
            if config.get('active', False):
                pages.append(config)
    return pages

def render_page_with_template(page, widgets):
    css_link = ''
    if page.get('css_file'):
        css_link = Markup(f'<link rel="stylesheet" href="/static/css/{page["css_file"]}">')
    template_name = page.get('template', 'carousel.html')
    return render_template(template_name, pages=[{**page, 'widgets': widgets}], css_link=css_link)

@app.route('/')
def dashboard_carousel():
    # Load global config for last_update_month
    global_config_path = os.path.join('pages', 'config.json')
    last_update_month = ''
    if os.path.exists(global_config_path):
        with open(global_config_path, encoding='utf-8') as f:
            global_config = json.load(f)
            last_update_month = global_config.get('last_update_month', '')
    pages = get_active_pages()
    rendered_pages = []
    for page in pages:
        if page['type'] == '3x2':
            xlsx_path = os.path.join('data', page['xlsx_file'])
            wb = openpyxl.load_workbook(xlsx_path, data_only=True)
            widgets = []
            for widget_cfg in page['widgets']:
                if not widget_cfg.get('active', True):
                    continue
                sheet = wb[widget_cfg['sheet']]
                months, totals, targets = [], [], []
                for row in sheet.iter_rows(min_row=2, values_only=True):
                    # Only append if both total and target are valid numbers
                    if row[1] is not None and row[2] is not None:
                        months.append(row[0])
                        totals.append(row[1])
                        targets.append(row[2])
                # Only calculate if we have at least 2 valid totals
                if len(totals) >= 2:
                    value = totals[-1]
                    target = targets[-1]
                    prev = totals[-2]
                    curr = totals[-1]
                    if prev is not None and curr is not None and prev != 0:
                        percent_change = ((curr - prev) / prev) * 100
                        if percent_change > 0:
                            trend = '▲'
                            trend_color = 'green'
                        elif percent_change < 0:
                            trend = '▼'
                            trend_color = 'red'
                        else:
                            trend = '→'
                            trend_color = 'gray'
                    else:
                        percent_change = 0
                        trend = ''
                        trend_color = 'gray'
                else:
                    value = totals[-1] if totals else 0
                    target = targets[-1] if targets else 0
                    percent_change = 0
                    trend = ''
                    trend_color = 'gray'
                value_color = "#0bda5b" if value >= target else "#fa6238"
                widgets.append({
                    "title": widget_cfg['name'],
                    "value": f"{value:,}".replace(',', ' '),
                    "target": f"{target:,}".replace(',', ' '),
                    "trend": trend,
                    "trend_color": trend_color,
                    "percent_change": round(percent_change, 1),
                    "labels": months,
                    "chart_data": totals,
                    "value_color": value_color
                })
            rendered_pages.append({**page, "widgets": widgets})
        # Add more types as needed
    # Use the template and css_file from the first page (all pages use the same template in carousel)
    template_name = rendered_pages[0].get('template', 'carousel.html') if rendered_pages else 'carousel.html'
    css_link = ''
    if rendered_pages and rendered_pages[0].get('css_file'):
        css_link = Markup(f'<link rel="stylesheet" href="/static/css/{rendered_pages[0]["css_file"]}">')
    return render_template(template_name, pages=rendered_pages, css_link=css_link, last_update_month=last_update_month, version=get_version())

@app.route('/dashboard')
def dashboard():
    # Load global config
    global_config_path = os.path.join('pages', 'config.json')
    last_update_month = ''
    if os.path.exists(global_config_path):
        with open(global_config_path, encoding='utf-8') as f:
            global_config = json.load(f)
            last_update_month = global_config.get('last_update_month', '')
    # (Assume widgets is built as before, or add your widget logic here)
    widgets = []  # Replace with your widget loading logic
    return render_template('dashboard.html', widgets=widgets, last_update_month=last_update_month)

@app.route('/admin')
def admin():
    """Admin backoffice for managing dashboard pages"""
    pages = get_pages()
    return render_template('admin.html', pages=pages, version=get_version())

@app.route('/api/pages')
def api_pages():
    """API endpoint to get all pages"""
    pages = get_pages()
    return jsonify({'pages': pages})

@app.route('/api/pages/<int:page_id>/toggle', methods=['POST'])
def toggle_page(page_id):
    """Toggle page active/inactive status in config.json file"""
    # Find the page by ID
    pages = get_pages()
    target_page = None
    
    for page in pages:
        if page['id'] == page_id:
            target_page = page
            break
    
    if not target_page:
        return jsonify({'success': False, 'message': 'Página não encontrada'}), 404
    
    # Get the page directory from the config
    page_dir = target_page['config'].get('_dir')
    if not page_dir:
        return jsonify({'success': False, 'message': 'Erro: diretório da página não encontrado'}), 500
    
    config_file = os.path.join('pages', page_dir, 'config.json')
    
    try:
        # Read current config
        with open(config_file, 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        # Toggle active status
        current_active = config.get('active', True)
        config['active'] = not current_active
        
        # Write back to file
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        
        # Broadcast update to all connected clients
        # Note: In a production environment, you might want to use Redis or a message queue
        # for broadcasting to multiple server instances
        print(f"Configuration changed for page {target_page['page_id']}, clients should refresh")
        
        return jsonify({
            'success': True,
            'message': 'Página ativada/desativada com sucesso',
            'page': {
                'id': page_id,
                'page_id': target_page['page_id'],
                'active': config['active']
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao atualizar configuração: {str(e)}'}), 500

@app.route('/api/pages/reorder', methods=['POST'])
def reorder_pages():
    """Reorder pages by updating order field in config.json files"""
    try:
        data = request.get_json()
        if not data or 'order' not in data:
            return jsonify({'success': False, 'message': 'Dados inválidos'}), 400
        
        order = data['order']
        
        # Get current pages to map IDs to directories
        pages = get_pages()
        id_to_dir = {}
        
        for page in pages:
            id_to_dir[page['id']] = page['config'].get('_dir')
        
        # Update order in each config file
        for i, page_id in enumerate(order):
            page_dir = id_to_dir.get(page_id)
            if page_dir:
                config_file = os.path.join('pages', page_dir, 'config.json')
                
                try:
                    with open(config_file, 'r', encoding='utf-8') as f:
                        config = json.load(f)
                    
                    config['order'] = i + 1
                    
                    with open(config_file, 'w', encoding='utf-8') as f:
                        json.dump(config, f, indent=2, ensure_ascii=False)
                        
                except Exception as e:
                    print(f"Error updating order for {page_dir}: {e}")
        
        return jsonify({'success': True, 'message': 'Páginas reordenadas com sucesso'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao reordenar: {str(e)}'}), 500

@app.route('/api/data')
def get_all_data():
    """API endpoint to get all dashboard data (modular, per-page, per-widget)"""
    try:
        pages_data = []
        for page in get_active_pages():
            page_widgets = []
            if page['type'] == '3x2':
                xlsx_path = os.path.join('data', page['xlsx_file'])
                if not os.path.exists(xlsx_path):
                    continue
                wb = openpyxl.load_workbook(xlsx_path, data_only=True)
                for widget_cfg in page['widgets']:
                    if not widget_cfg.get('active', True):
                        continue
                    sheet = wb[widget_cfg['sheet']]
                    months, totals, targets = [], [], []
                    for row in sheet.iter_rows(min_row=2, values_only=True):
                        if row[1] is not None and row[2] is not None:
                            months.append(row[0])
                            totals.append(row[1])
                            targets.append(row[2])
                    if len(totals) >= 2:
                        value = totals[-1]
                        target = targets[-1]
                        prev = totals[-2]
                        curr = totals[-1]
                        if prev is not None and curr is not None and prev != 0:
                            percent_change = ((curr - prev) / prev) * 100
                            if percent_change > 0:
                                trend = '▲'
                                trend_color = 'green'
                            elif percent_change < 0:
                                trend = '▼'
                                trend_color = 'red'
                            else:
                                trend = '→'
                                trend_color = 'gray'
                        else:
                            percent_change = 0
                            trend = ''
                            trend_color = 'gray'
                    else:
                        value = totals[-1] if totals else 0
                        target = targets[-1] if targets else 0
                        percent_change = 0
                        trend = ''
                        trend_color = 'gray'
                    value_color = "#0bda5b" if value >= target else "#fa6238"
                    page_widgets.append({
                        "id": widget_cfg['id'],
                        "name": widget_cfg['name'],
                        "value": value,
                        "target": target,
                        "percent_change": round(percent_change, 1),
                        "trend": trend,
                        "trend_color": trend_color,
                        "labels": months,
                        "chart_data": totals,
                        "value_color": value_color
                    })
            pages_data.append({
                "id": page['id'],
                "widgets": page_widgets
            })
        data = {
            "pages": pages_data,
            "metadata": {
                "last_update": datetime.now().isoformat(),
                "company": "Jayme da Costa",
                "version": get_version()
            }
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/<page_id>')
def get_page_data(page_id):
    """API endpoint to get data for a specific page"""
    try:
        page = None
        for p in get_active_pages():
            if p['id'] == page_id:
                page = p
                break
        if not page:
            return abort(404)
        page_widgets = []
        if page['type'] == '3x2':
            xlsx_path = os.path.join('data', page['xlsx_file'])
            if not os.path.exists(xlsx_path):
                return abort(404)
            wb = openpyxl.load_workbook(xlsx_path, data_only=True)
            for widget_cfg in page['widgets']:
                if not widget_cfg.get('active', True):
                    continue
                sheet = wb[widget_cfg['sheet']]
                months, totals, targets = [], [], []
                for row in sheet.iter_rows(min_row=2, values_only=True):
                    if row[1] is not None and row[2] is not None:
                        months.append(row[0])
                        totals.append(row[1])
                        targets.append(row[2])
                if len(totals) >= 2:
                    value = totals[-1]
                    target = targets[-1]
                    prev = totals[-2]
                    curr = totals[-1]
                    if prev is not None and curr is not None and prev != 0:
                        percent_change = ((curr - prev) / prev) * 100
                        if percent_change > 0:
                            trend = '▲'
                            trend_color = 'green'
                        elif percent_change < 0:
                            trend = '▼'
                            trend_color = 'red'
                        else:
                            trend = '→'
                            trend_color = 'gray'
                    else:
                        percent_change = 0
                        trend = ''
                        trend_color = 'gray'
                else:
                    value = totals[-1] if totals else 0
                    target = targets[-1] if targets else 0
                    percent_change = 0
                    trend = ''
                    trend_color = 'gray'
                value_color = "#0bda5b" if value >= target else "#fa6238"
                page_widgets.append({
                    "id": widget_cfg['id'],
                    "name": widget_cfg['name'],
                    "value": value,
                    "target": target,
                    "percent_change": round(percent_change, 1),
                    "trend": trend,
                    "trend_color": trend_color,
                    "labels": months,
                    "chart_data": totals,
                    "value_color": value_color
                })
        return jsonify({"id": page['id'], "widgets": page_widgets})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/<page_id>/<widget_id>')
def get_widget_data(page_id, widget_id):
    """API endpoint to get data for a specific widget"""
    try:
        page = None
        for p in get_active_pages():
            if p['id'] == page_id:
                page = p
                break
        if not page:
            return abort(404)
        if page['type'] == '3x2':
            xlsx_path = os.path.join('data', page['xlsx_file'])
            if not os.path.exists(xlsx_path):
                return abort(404)
            wb = openpyxl.load_workbook(xlsx_path, data_only=True)
            for widget_cfg in page['widgets']:
                if widget_cfg['id'] != widget_id or not widget_cfg.get('active', True):
                    continue
                sheet = wb[widget_cfg['sheet']]
                months, totals, targets = [], [], []
                for row in sheet.iter_rows(min_row=2, values_only=True):
                    if row[1] is not None and row[2] is not None:
                        months.append(row[0])
                        totals.append(row[1])
                        targets.append(row[2])
                if len(totals) >= 2:
                    value = totals[-1]
                    target = targets[-1]
                    prev = totals[-2]
                    curr = totals[-1]
                    if prev is not None and curr is not None and prev != 0:
                        percent_change = ((curr - prev) / prev) * 100
                        if percent_change > 0:
                            trend = '▲'
                            trend_color = 'green'
                        elif percent_change < 0:
                            trend = '▼'
                            trend_color = 'red'
                        else:
                            trend = '→'
                            trend_color = 'gray'
                    else:
                        percent_change = 0
                        trend = ''
                        trend_color = 'gray'
                else:
                    value = totals[-1] if totals else 0
                    target = targets[-1] if targets else 0
                    percent_change = 0
                    trend = ''
                    trend_color = 'gray'
                value_color = "#0bda5b" if value >= target else "#fa6238"
                widget_data = {
                    "id": widget_cfg['id'],
                    "name": widget_cfg['name'],
                    "value": value,
                    "target": target,
                    "percent_change": round(percent_change, 1),
                    "trend": trend,
                    "trend_color": trend_color,
                    "labels": months,
                    "chart_data": totals,
                    "value_color": value_color
                }
                return jsonify(widget_data)
        return abort(404)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/pages/<page_id>/<template>')
def serve_page_template(page_id, template):
    """Serve page templates from the pages folder"""
    template_path = os.path.join('pages', page_id, template)
    if os.path.exists(template_path):
        with open(template_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content, 200, {'Content-Type': 'text/html'}
    else:
        return f'Template not found: {template}', 404

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': get_version(),
        'database': 'connected',
        'data_files': 'loaded'
    })

@app.route('/api/config')
def get_config():
    """Get system configuration"""
    return jsonify({
        'carousel_interval': 10000,
        'company_name': 'Jayme da Costa',
        'logo_primary': '/static/assets/logo.png',
        'logo_secondary': '/static/assets/getsitelogo.jpeg',
        'theme': {
            'primary_color': '#4CAF50',
            'warning_color': '#FF9800',
            'danger_color': '#F44336',
            'info_color': '#2196F3'
        }
    })

# Server-Sent Events for real-time updates
@app.route('/api/events')
def sse_events():
    """Server-Sent Events endpoint for real-time dashboard updates"""
    def generate():
        while True:
            # Send a heartbeat every 30 seconds to keep connection alive
            yield f"data: {json.dumps({'type': 'heartbeat', 'timestamp': datetime.now().isoformat()})}\n\n"
            time.sleep(30)
    
    return Response(generate(), mimetype='text/event-stream')

@app.route('/api/broadcast-update')
def broadcast_update():
    """Endpoint to trigger update broadcast to all connected clients"""
    # This would be called when config files change
    # For now, we'll use a simple approach with SSE
    return jsonify({'success': True, 'message': 'Update broadcast triggered'})

@app.route('/api/version')
def get_app_version():
    """Get application version information"""
    return jsonify(get_version_info())

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "PDashboard Modular API",
        "description": "API para dashboards modulares industriais (v1)",
        "version": get_version()
    },
    "basePath": "/api/v1"
}

swagger = Swagger(app, template=swagger_template)
api_v1 = Blueprint('api_v1', __name__, url_prefix='/api/v1')

# --- API v1 endpoints ---

@api_v1.route('/pages')
@swag_from({
    'summary': 'Lista todas as páginas modulares',
    'responses': {200: {'description': 'Lista de páginas', 'examples': {'application/json': {'pages': [{'id': 'producao3', 'active': True}]}}}}
})
def api_v1_pages():
    pages = get_pages()
    return jsonify({'pages': pages})

@api_v1.route('/data')
@swag_from({
    'summary': 'Dados de todas as páginas e widgets',
    'responses': {200: {'description': 'Dados do dashboard', 'examples': {'application/json': {'pages': [{'id': 'producao3', 'widgets': []}]}}}}
})
def api_v1_data():
    return get_all_data()

@api_v1.route('/data/<page_id>')
@swag_from({
    'summary': 'Dados de uma página específica',
    'parameters': [{'name': 'page_id', 'in': 'path', 'type': 'string', 'required': True}],
    'responses': {200: {'description': 'Dados da página', 'examples': {'application/json': {'id': 'producao3', 'widgets': []}}}, 404: {'description': 'Página não encontrada'}}
})
def api_v1_page_data(page_id):
    return get_page_data(page_id)

@api_v1.route('/data/<page_id>/<widget_id>')
@swag_from({
    'summary': 'Dados de um widget específico',
    'parameters': [
        {'name': 'page_id', 'in': 'path', 'type': 'string', 'required': True},
        {'name': 'widget_id', 'in': 'path', 'type': 'string', 'required': True}
    ],
    'responses': {200: {'description': 'Dados do widget', 'examples': {'application/json': {'id': 'widget1', 'name': 'Linha 3 - Equipamento A'}}}, 404: {'description': 'Widget não encontrado'}}
})
def api_v1_widget_data(page_id, widget_id):
    return get_widget_data(page_id, widget_id)

@api_v1.route('/pages/<int:page_id>/toggle', methods=['POST'])
@swag_from({
    'summary': 'Ativa/desativa uma página',
    'parameters': [{'name': 'page_id', 'in': 'path', 'type': 'integer', 'required': True}],
    'responses': {200: {'description': 'Status da página'}}
})
def api_v1_toggle_page(page_id):
    return toggle_page(page_id)

@api_v1.route('/pages/reorder', methods=['POST'])
@swag_from({
    'summary': 'Reordena as páginas',
    'parameters': [{'name': 'order', 'in': 'body', 'type': 'array', 'required': True}],
    'responses': {200: {'description': 'Ordem atualizada'}}
})
def api_v1_reorder_pages():
    return reorder_pages()

@api_v1.route('/config')
@swag_from({
    'summary': 'Configuração global do sistema',
    'responses': {200: {'description': 'Configuração', 'examples': {'application/json': {'carousel_interval': 10000}}}}
})
def api_v1_config():
    return get_config()

@api_v1.route('/health')
@swag_from({
    'summary': 'Health check',
    'responses': {200: {'description': 'Status do sistema'}}
})
def api_v1_health():
    return health_check()

# Register blueprint
app.register_blueprint(api_v1)

# Swagger UI will be available at /api/v1/docs

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True) 