from flask import Flask, render_template, request, jsonify, redirect, url_for
import sqlite3
import os
from datetime import datetime
import pandas as pd

app = Flask(__name__)
app.secret_key = 'jayme_da_costa_dashboard_2024'

# Database initialization
def init_db():
    conn = sqlite3.connect('dashboard.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            template TEXT NOT NULL,
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
    
    # Insert default pages if they don't exist
    cursor.execute("SELECT COUNT(*) FROM pages")
    if cursor.fetchone()[0] == 0:
        default_pages = [
            ('Produção Mensal por Família', 'production_monthly', 1, 1),
            ('Previsão Próximos 3 Meses', 'forecast_3months', 1, 2),
            ('Valor Total em €', 'total_value', 1, 3)
        ]
        cursor.executemany(
            "INSERT INTO pages (title, template, active, order_num) VALUES (?, ?, ?, ?)",
            default_pages
        )
    
    conn.commit()
    conn.close()

@app.route('/')
def dashboard():
    """Main dashboard carousel view"""
    conn = sqlite3.connect('dashboard.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pages WHERE active = 1 ORDER BY order_num")
    pages = cursor.fetchall()
    conn.close()
    
    return render_template('dashboard.html', pages=pages)

@app.route('/admin')
def admin():
    """Admin backoffice for managing dashboard pages"""
    conn = sqlite3.connect('dashboard.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pages ORDER BY order_num")
    pages = cursor.fetchall()
    conn.close()
    
    return render_template('admin.html', pages=pages)

@app.route('/admin/toggle_page/<int:page_id>')
def toggle_page(page_id):
    """Toggle page active/inactive status"""
    conn = sqlite3.connect('dashboard.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE pages SET active = NOT active WHERE id = ?", (page_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('admin'))

@app.route('/admin/reorder', methods=['POST'])
def reorder_pages():
    """Reorder dashboard pages"""
    data = request.get_json()
    conn = sqlite3.connect('dashboard.db')
    cursor = conn.cursor()
    
    for item in data:
        cursor.execute("UPDATE pages SET order_num = ? WHERE id = ?", (item['order'], item['id']))
    
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

@app.route('/api/data/<data_type>')
def get_data(data_type):
    """API endpoint to get dashboard data"""
    try:
        # Try to read from Excel file first
        if os.path.exists('data/dashboard_data.xlsx'):
            if data_type == 'production_monthly':
                df = pd.read_excel('data/dashboard_data.xlsx', sheet_name='production')
                return jsonify(df.to_dict('records'))
            elif data_type == 'forecast_3months':
                df = pd.read_excel('data/dashboard_data.xlsx', sheet_name='forecast')
                return jsonify(df.to_dict('records'))
            elif data_type == 'total_value':
                df = pd.read_excel('data/dashboard_data.xlsx', sheet_name='values')
                return jsonify(df.to_dict('records'))
        
        # Fallback to sample data
        sample_data = get_sample_data(data_type)
        return jsonify(sample_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_sample_data(data_type):
    """Generate sample data for testing"""
    if data_type == 'production_monthly':
        return [
            {
                'familia': 'Equipamentos A',
                'produzido': 1250,
                'meta': 1200,
                'percentagem': 104,
                'status': 'success'
            },
            {
                'familia': 'Equipamentos B',
                'produzido': 980,
                'meta': 1000,
                'percentagem': 98,
                'status': 'warning'
            },
            {
                'familia': 'Equipamentos C',
                'produzido': 850,
                'meta': 900,
                'percentagem': 94,
                'status': 'danger'
            },
            {
                'familia': 'Equipamentos D',
                'produzido': 1100,
                'meta': 1100,
                'percentagem': 100,
                'status': 'success'
            },
            {
                'familia': 'Equipamentos E',
                'produzido': 1350,
                'meta': 1300,
                'percentagem': 104,
                'status': 'success'
            },
            {
                'familia': 'Equipamentos F',
                'produzido': 920,
                'meta': 950,
                'percentagem': 97,
                'status': 'warning'
            }
        ]
    elif data_type == 'forecast_3months':
        return [
            {'mes': 'Janeiro', 'previsao': 1200, 'real': 1250},
            {'mes': 'Fevereiro', 'previsao': 1100, 'real': 980},
            {'mes': 'Março', 'previsao': 1300, 'real': 1350}
        ]
    elif data_type == 'total_value':
        return [
            {'mes': 'Janeiro', 'valor': 1250, 'orçamento': 1200},
            {'mes': 'Fevereiro', 'valor': 980, 'orçamento': 1100},
            {'mes': 'Março', 'valor': 1350, 'orçamento': 1300}
        ]
    return []

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True) 