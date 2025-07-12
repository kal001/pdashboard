// Admin Panel JavaScript - Modular Page System
class AdminPanel {
    constructor() {
        this.pagesList = document.getElementById('pages-list');
        this.draggedItem = null;
        this.pages = [];
        
        this.init();
    }
    
    async init() {
        await this.loadPages();
        this.initDragAndDrop();
        this.loadDataStatus();
    }
    
    async loadPages() {
        try {
            const response = await fetch('/api/pages');
            const data = await response.json();
            
            if (response.ok) {
                this.pages = data.pages;
                this.renderPages();
            } else {
                console.error('Error loading pages:', data.error);
            }
        } catch (error) {
            console.error('Failed to load pages:', error);
        }
    }
    
    renderPages() {
        if (!this.pagesList) return;
        
        this.pagesList.innerHTML = '';
        
        this.pages.forEach(page => {
            const pageItem = document.createElement('div');
            pageItem.className = 'page-item';
            pageItem.dataset.pageId = page.id;
            pageItem.setAttribute('draggable', true);
            
            pageItem.innerHTML = `
                <div class="page-info">
                    <div class="page-header">
                        <span class="page-icon">${page.icon}</span>
                        <h3>${page.title}</h3>
                    </div>
                    <p class="page-description">${page.description}</p>
                    <p class="page-type">Tipo: ${page.type}</p>
                    <p class="page-order">Ordem: ${page.order}</p>
                    <div class="page-extra-info" style="margin-top: 10px;">
                        <p><strong>Template:</strong> ${page.config && page.config.template ? page.config.template : '-'}</p>
                        <p><strong>CSS:</strong> ${page.config && page.config.css_file ? page.config.css_file : '-'}</p>
                        <p><strong>Widgets ativos:</strong> ${page.config && page.config.widgets ? page.config.widgets.filter(w => w.active !== false).map(w => w.name).join(', ') : '-'}</p>
                    </div>
                </div>
                <div class="page-actions">
                    <button class="toggle-btn ${page.active ? 'active' : 'inactive'}" 
                            onclick="togglePage(${page.id})">
                        ${page.active ? 'Ativo' : 'Inativo'}
                    </button>
                </div>
                <div class="drag-handle">⋮⋮</div>
            `;
            
            this.pagesList.appendChild(pageItem);
        });
        
        this.initDragAndDrop();
    }
    
    initDragAndDrop() {
        if (!this.pagesList) return;
        
        const pageItems = this.pagesList.querySelectorAll('.page-item');
        
        pageItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedItem = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                this.draggedItem = null;
            });
            
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedItem && this.draggedItem !== item) {
                    this.reorderItems(this.draggedItem, item);
                }
            });
        });
    }
    
    reorderItems(draggedItem, targetItem) {
        const items = Array.from(this.pagesList.querySelectorAll('.page-item'));
        const draggedIndex = items.indexOf(draggedItem);
        const targetIndex = items.indexOf(targetItem);
        
        if (draggedIndex < targetIndex) {
            targetItem.parentNode.insertBefore(draggedItem, targetItem.nextSibling);
        } else {
            targetItem.parentNode.insertBefore(draggedItem, targetItem);
        }
        
        this.updateOrder();
    }
    
    updateOrder() {
        const items = Array.from(this.pagesList.querySelectorAll('.page-item'));
        const orderData = items.map((item, index) => parseInt(item.dataset.pageId));
        
        // Update visual order numbers
        items.forEach((item, index) => {
            const orderElement = item.querySelector('.page-order');
            if (orderElement) {
                orderElement.textContent = `Ordem: ${index + 1}`;
            }
        });
        
        // Send to server
        this.saveOrder(orderData);
    }
    
    async saveOrder(orderData) {
        try {
            const response = await fetch('/api/pages/reorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order: orderData })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                this.showMessage('Ordem das páginas atualizada com sucesso!', 'success');
            } else {
                this.showMessage('Erro ao atualizar ordem das páginas.', 'error');
            }
        } catch (error) {
            console.error('Error saving order:', error);
            this.showMessage('Erro ao atualizar ordem das páginas.', 'error');
        }
    }
    
    async loadDataStatus() {
        const statusContainer = document.getElementById('data-status-content');
        if (!statusContainer) return;
        
        try {
            // Check if data is available
            const response = await fetch('/api/data');
            const data = await response.json();
            
            if (response.ok) {
                const lastUpdate = new Date(data.metadata.last_update).toLocaleString('pt-PT');
                
                statusContainer.innerHTML = `
                    <div style="color: #4CAF50; font-weight: bold;">
                        ✅ Dados carregados com sucesso
                    </div>
                    <div style="margin-top: 10px; font-size: 14px;">
                        <strong>Última atualização:</strong> ${lastUpdate}
                    </div>
                    <div style="margin-top: 5px; font-size: 14px;">
                        <strong>Versão:</strong> ${data.metadata.version}
                    </div>
                    <div style="margin-top: 10px;">
                        <strong>Páginas ativas:</strong> ${this.pages.filter(p => p.active).length} de ${this.pages.length}
                    </div>
                `;
            } else {
                statusContainer.innerHTML = `
                    <div style="color: #f44336; font-weight: bold;">
                        ❌ Erro ao carregar dados
                    </div>
                    <div style="margin-top: 10px; font-size: 14px;">
                        Verifique se os ficheiros Excel existem na pasta data/
                    </div>
                `;
            }
        } catch (error) {
            statusContainer.innerHTML = `
                <div style="color: #f44336; font-weight: bold;">
                    ❌ Erro de conexão
                </div>
                <div style="margin-top: 10px; font-size: 14px;">
                    Não foi possível conectar ao servidor
                </div>
            `;
        }
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Insert at the top of admin content
        const adminContent = document.querySelector('.admin-content');
        if (adminContent) {
            adminContent.insertBefore(messageDiv, adminContent.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
}

// Global function for toggle button
async function togglePage(pageId) {
    // Add loading state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Carregando...';
    button.disabled = true;
    
    try {
        const response = await fetch(`/api/pages/${pageId}/toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Update button state
            const isActive = result.page.active;
            button.textContent = isActive ? 'Ativo' : 'Inativo';
            button.className = `toggle-btn ${isActive ? 'active' : 'inactive'}`;
            button.disabled = false;
            // Show success message
            const adminPanel = window.adminPanel;
            if (adminPanel) {
                adminPanel.showMessage(result.message, 'success');
            }
        } else {
            button.textContent = originalText;
            button.disabled = false;
            
            const adminPanel = window.adminPanel;
            if (adminPanel) {
                adminPanel.showMessage('Erro ao alterar estado da página.', 'error');
            }
        }
    } catch (error) {
        console.error('Error toggling page:', error);
        button.textContent = originalText;
        button.disabled = false;
        
        const adminPanel = window.adminPanel;
        if (adminPanel) {
            adminPanel.showMessage('Erro de conexão.', 'error');
        }
    }
}

// Fetch and update the header version dynamically
async function updateHeaderVersion() {
    try {
        const response = await fetch('/api/version');
        if (response.ok) {
            const data = await response.json();
            const versionSpan = document.getElementById('header-version');
            if (versionSpan && data.version) {
                versionSpan.textContent = `v${data.version}`;
            }
        }
    } catch (e) {
        // Optionally handle error
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
    updateHeaderVersion();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save order
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const adminPanel = window.adminPanel;
        if (adminPanel) {
            adminPanel.updateOrder();
        }
    }
    
    // Escape to clear any selections
    if (e.key === 'Escape') {
        const draggingItems = document.querySelectorAll('.page-item.dragging');
        draggingItems.forEach(item => item.classList.remove('dragging'));
    }
});

// Auto-refresh data status and header version every 30 seconds
setInterval(() => {
    const adminPanel = window.adminPanel;
    if (adminPanel) {
        adminPanel.loadDataStatus();
    }
    updateHeaderVersion();
}, 30000); 