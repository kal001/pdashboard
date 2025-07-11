// Dashboard JavaScript - Carousel and Data Management
class DashboardCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.totalSlides = this.slides.length;
        this.interval = 10000; // 10 seconds
        this.carouselTimer = null;
        this.dataCache = {};
        
        this.init();
    }
    
    init() {
        if (this.totalSlides === 0) return;
        
        this.updateDateTime();
        this.startCarousel();
        this.loadAllData();
        
        // Update time every second
        setInterval(() => this.updateDateTime(), 1000);
        
        // Update data every 5 minutes
        setInterval(() => this.loadAllData(), 300000);
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
            minute: '2-digit',
            second: '2-digit'
        });
        
        document.getElementById('current-date').textContent = dateStr;
        document.getElementById('current-time').textContent = timeStr;
        document.getElementById('last-update-time').textContent = timeStr;
    }
    
    startCarousel() {
        this.showSlide(0);
        this.carouselTimer = setInterval(() => {
            this.nextSlide();
        }, this.interval);
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
            this.currentSlide = index;
            
            // Load data for current slide if not cached
            const template = this.slides[index].dataset.template;
            if (template && !this.dataCache[template]) {
                this.loadData(template);
            }
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    }
    
    async loadAllData() {
        const templates = ['production_monthly', 'forecast_3months', 'total_value'];
        
        for (const template of templates) {
            await this.loadData(template);
        }
    }
    
    async loadData(template) {
        try {
            const response = await fetch(`/api/data/${template}`);
            const data = await response.json();
            
            if (response.ok) {
                this.dataCache[template] = data;
                this.renderData(template, data);
            } else {
                console.error(`Error loading ${template} data:`, data.error);
            }
        } catch (error) {
            console.error(`Failed to load ${template} data:`, error);
        }
    }
    
    renderData(template, data) {
        const container = document.getElementById(`data-${template}`);
        if (!container) return;
        
        switch (template) {
            case 'production_monthly':
                this.renderProductionMonthly(container, data);
                break;
            case 'forecast_3months':
                this.renderForecast3Months(container, data);
                break;
            case 'total_value':
                this.renderTotalValue(container, data);
                break;
        }
    }
    
    renderProductionMonthly(container, data) {
        const grid = document.createElement('div');
        grid.className = 'production-grid';
        
        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `production-item ${item.status}`;
            
            const percentage = Math.round((item.produzido / item.meta) * 100);
            const statusClass = percentage >= 100 ? 'success' : 
                              percentage >= 95 ? 'warning' : 'danger';
            
            itemDiv.innerHTML = `
                <h3>${item.familia}</h3>
                <div class="production-numbers">
                    <div class="production-produced">${item.produzido.toLocaleString('pt-PT')}</div>
                    <div class="production-target">Meta: ${item.meta.toLocaleString('pt-PT')}</div>
                </div>
                <div class="production-percentage ${statusClass}">${percentage}%</div>
                <div class="production-status">
                    ${percentage >= 100 ? '✅ Acima da meta' : 
                      percentage >= 95 ? '⚠️ Próximo da meta' : '❌ Abaixo da meta'}
                </div>
            `;
            
            grid.appendChild(itemDiv);
        });
        
        container.innerHTML = '';
        container.appendChild(grid);
    }
    
    renderForecast3Months(container, data) {
        const forecastDiv = document.createElement('div');
        forecastDiv.className = 'forecast-container';
        
        const chartDiv = document.createElement('div');
        chartDiv.className = 'forecast-chart';
        
        const barsDiv = document.createElement('div');
        barsDiv.className = 'forecast-bars';
        
        // Find max value for scaling
        const maxValue = Math.max(...data.map(item => Math.max(item.previsao, item.real)));
        
        data.forEach(item => {
            const barDiv = document.createElement('div');
            barDiv.className = 'forecast-bar';
            
            const forecastHeight = (item.previsao / maxValue) * 250;
            const realHeight = (item.real / maxValue) * 250;
            
            barDiv.innerHTML = `
                <div class="bar-container">
                    <div class="bar bar-forecast" style="height: ${forecastHeight}px;">
                        <div class="bar-value">${item.previsao}</div>
                    </div>
                    <div class="bar bar-real" style="height: ${realHeight}px;">
                        <div class="bar-value">${item.real}</div>
                    </div>
                </div>
                <div class="bar-label">${item.mes}</div>
            `;
            
            barsDiv.appendChild(barDiv);
        });
        
        chartDiv.appendChild(barsDiv);
        forecastDiv.appendChild(chartDiv);
        
        // Add legend
        const legendDiv = document.createElement('div');
        legendDiv.className = 'forecast-legend';
        legendDiv.innerHTML = `
            <div style="display: flex; gap: 30px; justify-content: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; background: #FF9800;"></div>
                    <span>Previsão</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 20px; height: 20px; background: #4CAF50;"></div>
                    <span>Real</span>
                </div>
            </div>
        `;
        forecastDiv.appendChild(legendDiv);
        
        container.innerHTML = '';
        container.appendChild(forecastDiv);
    }
    
    renderTotalValue(container, data) {
        const valueDiv = document.createElement('div');
        valueDiv.className = 'value-container';
        
        // Get current month value
        const currentMonth = data[data.length - 1];
        const currentValue = currentMonth.valor;
        
        const mainDiv = document.createElement('div');
        mainDiv.className = 'value-main';
        mainDiv.innerHTML = `
            <div class="value-current">${(currentValue / 1000).toFixed(0)}k€</div>
            <div class="value-label">Valor Total Produção - ${currentMonth.mes}</div>
        `;
        
        const chartDiv = document.createElement('div');
        chartDiv.className = 'value-chart';
        
        // Create simple bar chart for monthly values
        const chartBars = document.createElement('div');
        chartBars.style.display = 'flex';
        chartBars.style.alignItems = 'end';
        chartBars.style.justifyContent = 'space-around';
        chartBars.style.height = '200px';
        chartBars.style.marginTop = '20px';
        
        const maxValue = Math.max(...data.map(item => item.valor));
        
        data.forEach(item => {
            const barHeight = (item.valor / maxValue) * 150;
            const barDiv = document.createElement('div');
            barDiv.style.display = 'flex';
            barDiv.style.flexDirection = 'column';
            barDiv.style.alignItems = 'center';
            barDiv.style.width = '80px';
            
            barDiv.innerHTML = `
                <div style="width: 40px; height: ${barHeight}px; background: #4CAF50; border-radius: 5px 5px 0 0;"></div>
                <div style="margin-top: 10px; font-size: 14px; text-align: center;">
                    ${(item.valor / 1000).toFixed(0)}k€
                </div>
                <div style="font-size: 12px; color: #666;">${item.mes}</div>
            `;
            
            chartBars.appendChild(barDiv);
        });
        
        chartDiv.appendChild(chartBars);
        valueDiv.appendChild(mainDiv);
        valueDiv.appendChild(chartDiv);
        
        container.innerHTML = '';
        container.appendChild(valueDiv);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardCarousel();
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