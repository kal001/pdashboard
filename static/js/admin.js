// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.pagesList = document.getElementById('pages-list');
        this.draggedItem = null;
        
        this.init();
    }
    
    init() {
        this.initDragAndDrop();
        this.loadDataStatus();
    }
    
    initDragAndDrop() {
        if (!this.pagesList) return;
        
        const pageItems = this.pagesList.querySelectorAll('.page-item');
        
        pageItems.forEach(item => {
            item.setAttribute('draggable', true);
            
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
        const orderData = items.map((item, index) => ({
            id: parseInt(item.dataset.pageId),
            order: index + 1
        }));
        
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
            const response = await fetch('/admin/reorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            
            if (response.ok) {
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
            // Check if Excel file exists
            const response = await fetch('/api/data/production_monthly');
            const data = await response.json();
            
            if (response.ok) {
                statusContainer.innerHTML = `
                    <div style="color: #4CAF50; font-weight: bold;">
                        ✅ Dados carregados com sucesso
                    </div>
                    <div style="margin-top: 10px; font-size: 14px;">
                        <strong>Última atualização:</strong> ${new Date().toLocaleString('pt-PT')}
                    </div>
                    <div style="margin-top: 5px; font-size: 14px;">
                        <strong>Fonte:</strong> ${data.length > 0 ? 'Ficheiro Excel' : 'Dados de exemplo'}
                    </div>
                `;
            } else {
                statusContainer.innerHTML = `
                    <div style="color: #f44336; font-weight: bold;">
                        ❌ Erro ao carregar dados
                    </div>
                    <div style="margin-top: 10px; font-size: 14px;">
                        Verifique se o ficheiro Excel existe em data/dashboard_data.xlsx
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
function togglePage(pageId) {
    // Add loading state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Carregando...';
    button.disabled = true;
    
    // Redirect to toggle endpoint
    window.location.href = `/admin/toggle_page/${pageId}`;
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
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

// Auto-refresh data status every 30 seconds
setInterval(() => {
    const adminPanel = window.adminPanel;
    if (adminPanel) {
        adminPanel.loadDataStatus();
    }
}, 30000); 