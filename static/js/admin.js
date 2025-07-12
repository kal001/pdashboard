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
        
        this.pages.forEach((page, idx) => {
            const pageItem = document.createElement('div');
            pageItem.className = 'page-item';
            pageItem.dataset.pageId = page.page_id; // Use actual page ID, not sequential ID
            pageItem.setAttribute('draggable', true);

            // Determine data file label and value
            let dataFileLabel = '';
            let dataFileValue = '';
            if (page.type === '3x2' || page.type === '2x2' || page.type === '2x1-graph' || page.type === '2x2-cards') {
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
                            (page.type === '3x2' || page.type === '2x2' || page.type === '2x1-graph')
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
                    <button class="arrow-btn up-arrow" title="${window.t('move_up')}" ${idx === 0 ? 'disabled' : ''}>&#9650;</button>
                    <button class="arrow-btn down-arrow" title="${window.t('move_down')}" ${idx === this.pages.length - 1 ? 'disabled' : ''}>&#9660;</button>
                </div>
                <div class="drag-handle">⋮⋮</div>
            `;
            
            // Add event listeners for up/down arrows
            const upBtn = pageItem.querySelector('.up-arrow');
            const downBtn = pageItem.querySelector('.down-arrow');
            if (upBtn) {
                upBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.movePage(idx, idx - 1);
                });
            }
            if (downBtn) {
                downBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.movePage(idx, idx + 1);
                });
            }
            this.pagesList.appendChild(pageItem);
        });
        
        this.initDragAndDrop();
    }
    
    initDragAndDrop() {
        if (!this.pagesList) return;
        const pageItems = this.pagesList.querySelectorAll('.page-item');
        const container = this.pagesList;
        let dropIndicator = document.createElement('div');
        dropIndicator.className = 'drop-indicator';
        let lastDropTarget = null;
        let lastDropPosition = null;

        // Auto-scroll variables
        let autoScrollInterval = null;
        const SCROLL_ZONE_HEIGHT = 60;
        const SCROLL_SPEED = 18;

        // Helper to clear drop indicator
        function clearDropIndicator() {
            if (dropIndicator.parentNode) {
                dropIndicator.parentNode.removeChild(dropIndicator);
            }
            lastDropTarget = null;
            lastDropPosition = null;
        }

        // Helper for auto-scroll
        function startAutoScroll(e) {
            if (autoScrollInterval) return;
            autoScrollInterval = setInterval(() => {
                const rect = container.getBoundingClientRect();
                if (e.clientY < rect.top + SCROLL_ZONE_HEIGHT) {
                    window.scrollBy(0, -SCROLL_SPEED);
                } else if (e.clientY > rect.bottom - SCROLL_ZONE_HEIGHT) {
                    window.scrollBy(0, SCROLL_SPEED);
                }
            }, 30);
        }
        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        pageItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                if (e.target.classList.contains('drag-handle') || e.target.classList.contains('page-item')) {
                    this.draggedItem = item;
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', item.dataset.pageId);
                } else {
                    e.preventDefault();
                }
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                this.draggedItem = null;
                clearDropIndicator();
                stopAutoScroll();
            });
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                // Auto-scroll
                startAutoScroll(e);
                // Drop indicator logic
                if (this.draggedItem && this.draggedItem !== item) {
                    const rect = item.getBoundingClientRect();
                    const offset = e.clientY - rect.top;
                    const position = offset < rect.height / 2 ? 'above' : 'below';
                    if (lastDropTarget !== item || lastDropPosition !== position) {
                        clearDropIndicator();
                        if (position === 'above') {
                            item.parentNode.insertBefore(dropIndicator, item);
                        } else {
                            item.parentNode.insertBefore(dropIndicator, item.nextSibling);
                        }
                        lastDropTarget = item;
                        lastDropPosition = position;
                    }
                }
            });
            item.addEventListener('dragleave', (e) => {
                // Only clear if leaving the item and not entering the indicator
                if (!e.relatedTarget || !e.relatedTarget.classList || !e.relatedTarget.classList.contains('drop-indicator')) {
                    clearDropIndicator();
                }
                stopAutoScroll();
            });
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                clearDropIndicator();
                stopAutoScroll();
                if (this.draggedItem && this.draggedItem !== item) {
                    const rect = item.getBoundingClientRect();
                    const offset = e.clientY - rect.top;
                    const position = offset < rect.height / 2 ? 'above' : 'below';
                    if (position === 'above') {
                        item.parentNode.insertBefore(this.draggedItem, item);
                    } else {
                        item.parentNode.insertBefore(this.draggedItem, item.nextSibling);
                    }
                    this.updateOrder();
                }
            });
        });
        // Also handle dragover on the container for auto-scroll at edges
        container.addEventListener('dragover', (e) => {
            startAutoScroll(e);
        });
        container.addEventListener('dragleave', stopAutoScroll);
        container.addEventListener('drop', stopAutoScroll);
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
        const orderData = items.map((item, index) => item.dataset.pageId); // Use string IDs, not integers
        
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

    movePage(fromIdx, toIdx) {
        if (toIdx < 0 || toIdx >= this.pages.length) return;
        const temp = this.pages[fromIdx];
        this.pages.splice(fromIdx, 1);
        this.pages.splice(toIdx, 0, temp);
        this.renderPages();
        this.updateOrder();
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