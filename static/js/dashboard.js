// Dashboard JavaScript - Modular Page System
class DashboardCarousel {
    constructor() {
        this.currentSlide = 0;
        this.pages = [];
        this.totalSlides = 0;
        this.interval = 10000; // 10 seconds
        this.carouselTimer = null;
        this.dataCache = {};
        this.charts = {};
        
        this.init();
    }
    
    async init() {
        await this.loadPages();
        this.updateDateTime();
        this.startCarousel();
        this.loadAllData();
        this.initNavigationDots();
        
        // Update time every second
        setInterval(() => this.updateDateTime(), 1000);
        
        // Update data every 5 minutes
        setInterval(() => this.loadAllData(), 300000);
    }
    
    async loadPages() {
        try {
            const response = await fetch('/api/pages');
            const data = await response.json();
            
            if (response.ok) {
                this.pages = data.pages.filter(page => page.active);
                this.totalSlides = this.pages.length;
                this.renderPages();
            } else {
                console.error('Error loading pages:', data.error);
            }
        } catch (error) {
            console.error('Failed to load pages:', error);
        }
    }
    
    renderPages() {
        const container = document.getElementById('carousel-container');
        const navDots = document.getElementById('nav-dots');
        
        if (!container || !navDots) return;
        
        // Clear existing content
        container.innerHTML = '';
        navDots.innerHTML = '';
        
        // Create slides
        this.pages.forEach((page, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            slide.dataset.pageId = page.id;
            slide.dataset.pageType = page.type;
            
            slide.innerHTML = `
                <div class="slide-content">
                    <div class="page-content" id="page-content-${page.id}">
                        <!-- Page content will be loaded here -->
                    </div>
                </div>
            `;
            
            container.appendChild(slide);
            
            // Create navigation dot
            const dot = document.createElement('div');
            dot.className = `nav-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.view = index;
            navDots.appendChild(dot);
        });
        
        // Update slides reference
        this.slides = document.querySelectorAll('.carousel-slide');
    }
    
    updateDateTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-PT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeStr = now.toLocaleTimeString('pt-PT', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const dateElement = document.getElementById('current-date');
        const timeElement = document.getElementById('current-time');
        const updateTimeElement = document.getElementById('last-update-time');
        const lastUpdateElement = document.getElementById('last-update');
        
        if (dateElement) dateElement.textContent = dateStr;
        if (timeElement) timeElement.textContent = timeStr;
        if (updateTimeElement) updateTimeElement.textContent = timeStr;
        if (lastUpdateElement) lastUpdateElement.textContent = timeStr;
    }
    
    initNavigationDots() {
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showSlide(index);
            });
        });
    }
    
    startCarousel() {
        if (this.totalSlides === 0) return;
        
        this.showSlide(0);
        this.carouselTimer = setInterval(() => {
            this.nextSlide();
        }, this.interval);
    }
    
    showSlide(index) {
        if (this.totalSlides === 0) return;
        
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
            this.currentSlide = index;
            
            // Update navigation dots
            const dots = document.querySelectorAll('.nav-dot');
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // Load page content
            const page = this.pages[index];
            if (page) {
                this.loadPageContent(page);
            }
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    }
    
    async loadPageContent(page) {
        const contentContainer = document.getElementById(`page-content-${page.id}`);
        if (!contentContainer) return;
        
        // Load page template
        try {
            const response = await fetch(`/pages/${page.id}/${page.config.template}`);
            if (response.ok) {
                const html = await response.text();
                contentContainer.innerHTML = html;
                // Evaluate all <script> tags in the loaded HTML
                const scripts = contentContainer.querySelectorAll('script');
                scripts.forEach(script => {
                    if (script.textContent) {
                        try {
                            window.eval(script.textContent);
                        } catch (e) {
                            console.error('Error evaluating script:', e);
                        }
                    }
                });
                // Load and render data for this page
                await this.loadPageData(page);
            } else {
                contentContainer.innerHTML = `<div class="error-message">Erro ao carregar página: ${page.title}</div>`;
            }
        } catch (error) {
            console.error(`Error loading page ${page.id}:`, error);
            contentContainer.innerHTML = `<div class="error-message">Erro ao carregar página: ${page.title}</div>`;
        }
    }
    
    async loadPageData(page) {
        const dataSource = page.config.data_source;
        if (!dataSource) return;
        
        try {
            const response = await fetch(`/api/data/${dataSource}`);
            const data = await response.json();
            
            if (response.ok) {
                this.dataCache[dataSource] = data;
                this.renderPageData(page, data);
            } else {
                console.error(`Error loading ${dataSource} data:`, data.error);
            }
        } catch (error) {
            console.error(`Failed to load ${dataSource} data:`, error);
        }
    }
    
    renderPageData(page, data) {
        const dataSource = page.config.data_source;
        
        switch (dataSource) {
            case 'production':
                if (typeof renderProductionPage === 'function') {
                    renderProductionPage(data);
                }
                break;
            case 'forecast':
                if (typeof renderForecastPage === 'function') {
                    renderForecastPage(data);
                }
                break;
            case 'financial':
                if (typeof renderFinancialPage === 'function') {
                    renderFinancialPage(data);
                }
                break;
            case 'performance':
                if (typeof renderPerformancePage === 'function') {
                    renderPerformancePage(data);
                }
                break;
        }
    }
    
    async loadAllData() {
        const dataSources = [...new Set(this.pages.map(page => page.config.data_source))];
        
        for (const dataSource of dataSources) {
            if (dataSource) {
                await this.loadData(dataSource);
            }
        }
    }
    
    async loadData(dataSource) {
        try {
            const response = await fetch(`/api/data/${dataSource}`);
            const data = await response.json();
            
            if (response.ok) {
                this.dataCache[dataSource] = data;
            } else {
                console.error(`Error loading ${dataSource} data:`, data.error);
            }
        } catch (error) {
            console.error(`Failed to load ${dataSource} data:`, error);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardCarousel = new DashboardCarousel();
});

// Handle visibility change to pause/resume carousel
document.addEventListener('visibilitychange', () => {
    const dashboard = window.dashboardCarousel;
    if (dashboard) {
        if (document.hidden) {
            clearInterval(dashboard.carouselTimer);
        } else {
            dashboard.startCarousel();
        }
    }
}); 