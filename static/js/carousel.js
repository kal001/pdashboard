// Carousel Auto-Refresh functionality
class DashboardCarousel {
    constructor() {
        this.lastConfigHash = null;
        this.refreshInterval = 30000; // Check every 30 seconds
        this.initAutoRefresh();
    }
    
    async initAutoRefresh() {
        // Get initial config hash
        await this.checkForUpdates();
        
        // Update footer version initially
        await this.updateFooterVersion();
        
        // Set up periodic checking
        setInterval(() => {
            this.checkForUpdates();
        }, this.refreshInterval);
        
        // Set up periodic version updates
        setInterval(() => {
            this.updateFooterVersion();
        }, this.refreshInterval);
    }
    
    async checkForUpdates() {
        try {
            const response = await fetch('/api/pages');
            const data = await response.json();
            
            if (response.ok) {
                // Create a simple hash of the configuration
                const configString = JSON.stringify(data.pages.map(p => ({
                    id: p.id,
                    active: p.active,
                    order: p.order
                })));
                
                const configHash = this.simpleHash(configString);
                
                if (this.lastConfigHash && this.lastConfigHash !== configHash) {
                    console.log('Configuration changed detected, refreshing dashboard...');
                    window.location.reload();
                }
                
                this.lastConfigHash = configHash;
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }
    
    async updateFooterVersion() {
        try {
            const response = await fetch('/api/version');
            if (response.ok) {
                const data = await response.json();
                const versionSpan = document.getElementById('footer-version');
                if (versionSpan && data.version) {
                    versionSpan.textContent = `v${data.version}`;
                }
            }
        } catch (error) {
            console.error('Error updating footer version:', error);
        }
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
}

// Initialize auto-refresh when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardCarousel = new DashboardCarousel();
}); 