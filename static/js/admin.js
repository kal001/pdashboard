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

            // Determine data file label and value
            let dataFileLabel = '';
            let dataFileValue = '';
            if (page.type === '3x2' || page.type === '2x2') {
                dataFileLabel = window.t('xlsx_file');
                dataFileValue = page.config && page.config.xlsx_file ? page.config.xlsx_file : '-';
            } else if (page.type === 'text-md') {
                dataFileLabel = window.t('markdown_file');
                dataFileValue = page.config && page.config.md_file ? page.config.md_file : '-';
            } else if (page.type === 'image') {
                dataFileLabel = window.t('image_file');
                dataFileValue = page.config && page.config.image_file ? page.config.image_file : '-';
            }

            pageItem.innerHTML = `
                <div class="page-info">
                    <div class="page-header">
                        <span class="page-icon">${page.icon}</span>
                        <h3>${page.title}</h3>
                    </div>
                    <p class="page-description">${page.description}</p>
                    <p class="page-type">${window.t('type')} ${page.type}</p>
                    <p class="page-order">${window.t('order')}${page.order}</p>
                    <div class="page-extra-info" style="margin-top: 10px;">
                        <p><strong>${window.t('template_label')}</strong> ${page.config && page.config.template ? page.config.template : '-'}</p>
                        <p><strong>${window.t('css_label')}</strong> ${page.config && page.config.css_file ? page.config.css_file : '-'}</p>
                        <p><strong>${dataFileLabel}</strong> ${dataFileValue}</p>
                        ${
                            (page.type === '3x2' || page.type === '2x2')
                            ? `<p><strong>${window.t('active_widgets')}</strong> ${page.config && page.config.widgets ? page.config.widgets.filter(w => w.active !== false).map(w => w.name).join(', ') : '-'}</p>`
                            : ''
                        }
                    </div>
                </div>
                <div class="page-actions">
                    <button class="toggle-btn ${page.active ? 'active' : 'inactive'}" 
                            onclick="togglePage(${page.id})">
                        ${page.active ? window.t('active') : window.t('inactive')}
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
                orderElement.textContent = `${window.t('order')}${index + 1}`;
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
                this.showMessage(window.t('order_updated'), 'success');
            } else {
                this.showMessage(window.t('error_updating_order'), 'error');
            }
        } catch (error) {
            console.error('Error saving order:', error);
            this.showMessage(window.t('error_updating_order'), 'error');
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
                const lastUpdate = new Date(data.metadata.last_update).toLocaleString();
                
                statusContainer.innerHTML = `
                    <div style="color: #4CAF50; font-weight: bold;">
                        ${window.t('data_loaded')}
                    </div>
                    <div style="margin-top: 10px; font-size: 14px;">
                        <strong>${window.t('last_update')}:</strong> ${lastUpdate}
                    </div>
                    <div style="margin-top: 5px; font-size: 14px;">
                        <strong>${window.t('version')}:</strong> ${data.metadata.version}
                    </div>
                    <div style="margin-top: 10px;">
                        <strong>${window.t('active_pages')}:</strong> ${this.pages.filter(p => p.active).length}${window.t('pages_count')}${this.pages.length}
                    </div>
                `;
            } else {
                statusContainer.innerHTML = `
                    <div style="color: #f44336; font-weight: bold;">
                        ${window.t('error_loading_data')}
                    </div>
                    <div style="margin-top: 10px; font-size: 14px;">
                        ${window.t('check_excel_files')}
                    </div>
                `;
            }
        } catch (error) {
            statusContainer.innerHTML = `
                <div style="color: #f44336; font-weight: bold;">
                    ${window.t('connection_error')}
                </div>
                <div style="margin-top: 10px; font-size: 14px;">
                    ${window.t('connection_failed')}
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
    button.textContent = window.t('loading');
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
            button.textContent = isActive ? window.t('active') : window.t('inactive');
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
                adminPanel.showMessage(window.t('error_toggling_page'), 'error');
            }
        }
    } catch (error) {
        console.error('Error toggling page:', error);
        button.textContent = originalText;
        button.disabled = false;
        
        const adminPanel = window.adminPanel;
        if (adminPanel) {
            adminPanel.showMessage(window.t('connection_error_short'), 'error');
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