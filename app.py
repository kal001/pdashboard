from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
from markupsafe import Markup
import sqlite3
import os
import json
from datetime import datetime
import pandas as pd
import glob
import openpyxl

app = Flask(__name__)
app.secret_key = 'jayme_da_costa_dashboard_2024'

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
    """Get all pages with their configuration"""
    conn = sqlite3.connect('dashboard.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pages ORDER BY order_num")
    db_pages = cursor.fetchall()
    conn.close()
    
    pages = []
    for db_page in db_pages:
        page_id = db_page[1]  # page_id column
        config_file = os.path.join('pages', page_id, 'config.json')
        
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                pages.append({
                    'id': db_page[0],  # database id
                    'page_id': page_id,
                    'title': config['title'],
                    'description': config.get('description', ''),
                    'icon': config.get('icon', '📄'),
                    'type': config.get('type', 'default'),
                    'active': bool(db_page[5]),  # active column
                    'order': db_page[6],  # order_num column
                    'config': config
                })
            except Exception as e:
                print(f"Error loading page config {config_file}: {e}")
    
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
    return render_template(template_name, pages=rendered_pages, css_link=css_link, last_update_month=last_update_month)

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
    return render_template('admin.html', pages=pages)

@app.route('/api/pages')
def api_pages():
    """API endpoint to get all pages"""
    pages = get_pages()
    return jsonify({'pages': pages})

@app.route('/api/pages/<int:page_id>/toggle', methods=['POST'])
def toggle_page(page_id):
    """Toggle page active/inactive status"""
    conn = sqlite3.connect('dashboard.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE pages SET active = NOT active WHERE id = ?", (page_id,))
    conn.commit()
    
    # Get updated page info
    cursor.execute("SELECT active FROM pages WHERE id = ?", (page_id,))
    result = cursor.fetchone()
    conn.close()
    
    if result:
        return jsonify({
            'success': True,
            'message': 'Página ativada/desativada com sucesso',
            'page': {
                'id': page_id,
                'active': bool(result[0])
            }
        })
    else:
        return jsonify({'success': False, 'message': 'Página não encontrada'}), 404

@app.route('/api/pages/reorder', methods=['POST'])
def reorder_pages():
    """Reorder dashboard pages"""
    data = request.get_json()
    if not data or 'order' not in data:
        return jsonify({'success': False, 'message': 'Dados inválidos'}), 400
    
    conn = sqlite3.connect('dashboard.db')
    cursor = conn.cursor()
    
    try:
        for index, page_id in enumerate(data['order']):
            cursor.execute("UPDATE pages SET order_num = ? WHERE id = ?", (index + 1, page_id))
        
        conn.commit()
        return jsonify({'success': True, 'message': 'Páginas reordenadas com sucesso'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao reordenar: {str(e)}'}), 500
    finally:
        conn.close()

@app.route('/api/data')
def get_all_data():
    """API endpoint to get all dashboard data"""
    try:
        data = {
            'production': get_production_data(),
            'forecast': get_forecast_data(),
            'financial': get_financial_data(),
            'performance': get_performance_data(),
            'metadata': {
                'last_update': datetime.now().isoformat(),
                'company': 'Jayme da Costa',
                'version': '1.0.0'
            }
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/<data_type>')
def get_data(data_type):
    """API endpoint to get specific data type"""
    try:
        if data_type == 'production':
            return jsonify(get_production_data())
        elif data_type == 'forecast':
            return jsonify(get_forecast_data())
        elif data_type == 'financial':
            return jsonify(get_financial_data())
        elif data_type == 'performance':
            return jsonify(get_performance_data())
        else:
            return jsonify({'error': 'Tipo de dados não encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_production_data():
    """Get production data"""
    try:
        # Try to read from Excel file first
        if os.path.exists('data/producao.xlsx'):
            df = pd.read_excel('data/producao.xlsx', sheet_name='producao')
            families = []
            for _, row in df.iterrows():
                percentage = float((row['produzido'] / row['meta']) * 100)
                status = 'success' if percentage >= 100 else 'warning' if percentage >= 95 else 'danger'
                families.append({
                    'name': str(row['familia']),
                    'produced': int(row['produzido']),
                    'target': int(row['meta']),
                    'percentage': round(percentage, 1),
                    'status': status,
                    'trend': [120, 130, 140, int(row['produzido'])]  # Sample trend data
                })
            return {
                'families': families,
                'total_produced': sum(f['produced'] for f in families),
                'total_target': sum(f['target'] for f in families),
                'overall_percentage': round((sum(f['produced'] for f in families) / sum(f['target'] for f in families)) * 100, 1)
            }
    except Exception as e:
        print(f"Error reading production data: {e}")
    
    # Fallback to sample data
    return {
        'families': [
            {
                'name': 'Família A',
                'produced': 150,
                'target': 140,
                'percentage': 107,
                'status': 'success',
                'trend': [120, 130, 140, 150]
            },
            {
                'name': 'Família B',
                'produced': 95,
                'target': 100,
                'percentage': 95,
                'status': 'warning',
                'trend': [110, 105, 100, 95]
            },
            {
                'name': 'Família C',
                'produced': 85,
                'target': 90,
                'percentage': 94,
                'status': 'danger',
                'trend': [95, 92, 88, 85]
            }
        ],
        'total_produced': 330,
        'total_target': 330,
        'overall_percentage': 100
    }

def get_forecast_data():
    """Get forecast data"""
    try:
        if os.path.exists('data/previsoes.xlsx'):
            df = pd.read_excel('data/previsoes.xlsx', sheet_name='previsoes')
            families = []
            months = ['Janeiro', 'Fevereiro', 'Março']
            
            for family_name in df['familia'].unique():
                family_data = df[df['familia'] == family_name]
                values = [int(row['previsao']) for _, row in family_data.iterrows()]
                families.append({
                    'name': family_name,
                    'values': values
                })
            
            return {
                'months': months,
                'families': families
            }
    except Exception as e:
        print(f"Error reading forecast data: {e}")
    
    # Fallback to sample data
    return {
        'months': ['Janeiro', 'Fevereiro', 'Março'],
        'families': [
            {
                'name': 'Família A',
                'values': [160, 170, 180]
            },
            {
                'name': 'Família B',
                'values': [110, 115, 120]
            }
        ]
    }

def get_financial_data():
    """Get financial data"""
    try:
        if os.path.exists('data/valores.xlsx'):
            df = pd.read_excel('data/valores.xlsx', sheet_name='valores')
            trend = [int(row['valor']) for _, row in df.iterrows()]
            months = [row['mes'] for _, row in df.iterrows()]
            
            return {
                'current_month': trend[-1] if trend else 0,
                'previous_month': trend[-2] if len(trend) > 1 else 0,
                'trend': trend,
                'months': months
            }
    except Exception as e:
        print(f"Error reading financial data: {e}")
    
    # Fallback to sample data
    return {
        'current_month': 1250,
        'previous_month': 1180,
        'trend': [1000, 1050, 1100, 1150, 1180, 1250],
        'months': ['Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    }

def get_performance_data():
    """Get performance data"""
    try:
        if os.path.exists('data/performance.xlsx'):
            df = pd.read_excel('data/performance.xlsx', sheet_name='performance')
            indicators = []
            for _, row in df.iterrows():
                status = 'success' if row['valor'] >= row['target'] else 'warning' if row['valor'] >= row['target'] * 0.95 else 'danger'
                indicators.append({
                    'name': row['indicador'],
                    'value': int(row['valor']),
                    'target': int(row['target']),
                    'status': status
                })
            return {'indicators': indicators}
    except Exception as e:
        print(f"Error reading performance data: {e}")
    
    # Fallback to sample data
    return {
        'indicators': [
            {
                'name': 'Eficiência',
                'value': 87,
                'target': 90,
                'status': 'warning'
            },
            {
                'name': 'Qualidade',
                'value': 98,
                'target': 95,
                'status': 'success'
            },
            {
                'name': 'Disponibilidade',
                'value': 92,
                'target': 95,
                'status': 'warning'
            }
        ]
    }

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
        'version': '1.0.0',
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

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True) 