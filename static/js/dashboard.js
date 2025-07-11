// Dashboard JavaScript - Modern Design with Chart.js
class DashboardCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.totalSlides = this.slides.length;
        this.interval = 10000; // 10 seconds
        this.carouselTimer = null;
        this.dataCache = {};
        this.charts = {};
        
        this.init();
    }
    
    init() {
        if (this.totalSlides === 0) return;
        
        this.updateDateTime();
        this.startCarousel();
        this.loadAllData();
        this.initNavigationDots();
        
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
            minute: '2-digit'
        });
        
        document.getElementById('current-date').textContent = dateStr;
        document.getElementById('current-time').textContent = timeStr;
        document.getElementById('last-update-time').textContent = timeStr;
        document.getElementById('last-update').textContent = timeStr;
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
            
            // Update navigation dots
            const dots = document.querySelectorAll('.nav-dot');
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
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
        const subtitleContainer = document.getElementById(`subtitle-${template}`);
        
        if (!container) return;
        
        switch (template) {
            case 'production_monthly':
                this.renderProductionMonthly(container, subtitleContainer, data);
                break;
            case 'forecast_3months':
                this.renderForecast3Months(container, subtitleContainer, data);
                break;
            case 'total_value':
                this.renderTotalValue(container, subtitleContainer, data);
                break;
        }
    }
    
    renderProductionMonthly(container, subtitleContainer, data) {
        if (subtitleContainer) {
            subtitleContainer.textContent = '📊 NOVEMBRO 2024 (ÚLTIMO MÊS FECHADO)';
        }
        
        const grid = document.createElement('div');
        grid.className = 'production-grid';
        
        const icons = ['💧', '⚡', '🔧', '🔩', '📡', '🖥️'];
        
        data.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `production-item ${item.status}`;
            
            const percentage = Math.round((item.produzido / item.meta) * 100);
            const statusClass = percentage >= 100 ? 'success' : 
                              percentage >= 95 ? 'warning' : 'danger';
            
            itemDiv.innerHTML = `
                <div class="production-icon">${icons[index] || '📦'}</div>
                <h3 class="family-name">${item.familia}</h3>
                <div class="production-numbers">
                    <div class="produced">${item.produzido.toLocaleString('pt-PT')}</div>
                    <div class="target">de ${item.meta.toLocaleString('pt-PT')} unidades</div>
                </div>
                <div class="production-percentage ${statusClass}">${percentage}%</div>
                <div class="production-status">
                    ${percentage >= 100 ? '✅ Acima da meta' : 
                      percentage >= 95 ? '⚠️ Próximo da meta' : '❌ Abaixo da meta'}
                </div>
                <div class="evolution">
                    <div class="evolution-title">Evolução 2024</div>
                    <div class="mini-chart">
                        <canvas id="chart-${index}" width="96" height="48"></canvas>
                    </div>
                </div>
            `;
            
            grid.appendChild(itemDiv);
        });
        
        container.innerHTML = '';
        container.appendChild(grid);
        
        // Create mini charts after DOM is updated
        setTimeout(() => {
            this.createMiniCharts(data);
        }, 100);
    }
    
    createMiniCharts(data) {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'];
        
        data.forEach((item, index) => {
            const canvasId = `chart-${index}`;
            const canvas = document.getElementById(canvasId);
            
            if (canvas && typeof Chart !== 'undefined') {
                // Generate sample data for the chart
                const chartData = this.generateChartData(item.produzido, item.meta);
                
                if (this.charts[canvasId]) {
                    this.charts[canvasId].destroy();
                }
                
                this.charts[canvasId] = new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels: months,
                        datasets: [{
                            data: chartData,
                            borderColor: '#3B82F6',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            pointBackgroundColor: '#3B82F6',
                            pointBorderColor: '#3B82F6',
                            pointRadius: 2,
                            tension: 0
                        }]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                        animation: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            x: {
                                display: true,
                                grid: { display: false },
                                ticks: { display: false }
                            },
                            y: {
                                display: false,
                                grid: { display: false }
                            }
                        },
                        elements: {
                            point: { hoverRadius: 0 }
                        }
                    }
                });
            }
        });
    }
    
    generateChartData(currentValue, target) {
        // Generate realistic chart data based on current value and target
        const data = [];
        const baseValue = target * 0.8; // Start at 80% of target
        
        for (let i = 0; i < 11; i++) {
            if (i === 10) {
                data.push(currentValue); // Current month
            } else {
                // Generate realistic progression
                const progress = i / 10;
                const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
                const value = baseValue + (currentValue - baseValue) * progress;
                data.push(Math.round(value * (1 + variation)));
            }
        }
        
        return data;
    }
    
    renderForecast3Months(container, subtitleContainer, data) {
        if (subtitleContainer) {
            subtitleContainer.textContent = '';
            subtitleContainer.style.display = 'none';
        }
        
        const forecastDiv = document.createElement('div');
        forecastDiv.className = 'forecast-container';
        
        const gridDiv = document.createElement('div');
        gridDiv.className = 'forecast-grid';
        
        const months = ['Dezembro', 'Janeiro', 'Fevereiro'];
        
        data.forEach((item, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'forecast-card';
            
            cardDiv.innerHTML = `
                <div class="forecast-month">
                    <div class="forecast-icon">📅</div>
                    <h3 class="forecast-month-name">${months[index] || item.mes}</h3>
                    <div class="forecast-value">${item.previsao}</div>
                    <div class="forecast-units">unidades</div>
                </div>
            `;
            
            gridDiv.appendChild(cardDiv);
        });
        
        // Add family details section
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'family-details';
        detailsDiv.innerHTML = `
            <h3>Previsão por Família</h3>
            <div class="family-grid">
                <div class="family-item">
                    <div class="family-item-left">
                        <span class="family-item-icon">💧</span>
                        <span class="family-item-name">Equipamentos A</span>
                    </div>
                    <div class="family-item-value">165</div>
                </div>
                <div class="family-item">
                    <div class="family-item-left">
                        <span class="family-item-icon">⚡</span>
                        <span class="family-item-name">Equipamentos B</span>
                    </div>
                    <div class="family-item-value">132</div>
                </div>
                <div class="family-item">
                    <div class="family-item-left">
                        <span class="family-item-icon">🔧</span>
                        <span class="family-item-name">Equipamentos C</span>
                    </div>
                    <div class="family-item-value">83</div>
                </div>
                <div class="family-item">
                    <div class="family-item-left">
                        <span class="family-item-icon">🔩</span>
                        <span class="family-item-name">Equipamentos D</span>
                    </div>
                    <div class="family-item-value">220</div>
                </div>
                <div class="family-item">
                    <div class="family-item-left">
                        <span class="family-item-icon">📡</span>
                        <span class="family-item-name">Equipamentos E</span>
                    </div>
                    <div class="family-item-value">198</div>
                </div>
                <div class="family-item">
                    <div class="family-item-left">
                        <span class="family-item-icon">🖥️</span>
                        <span class="family-item-name">Equipamentos F</span>
                    </div>
                    <div class="family-item-value">66</div>
                </div>
            </div>
        `;
        
        forecastDiv.appendChild(gridDiv);
        forecastDiv.appendChild(detailsDiv);
        
        container.innerHTML = '';
        container.appendChild(forecastDiv);
    }
    
    renderTotalValue(container, subtitleContainer, data) {
        if (subtitleContainer) {
            subtitleContainer.textContent = '';
            subtitleContainer.style.display = 'none';
        }
        
        const valueDiv = document.createElement('div');
        valueDiv.className = 'value-container';
        
        // Get current month value
        const currentMonth = data[data.length - 1];
        const currentValue = currentMonth.valor;
        
        const gridDiv = document.createElement('div');
        gridDiv.className = 'value-grid';
        
        // First card - Current month highlight
        const highlightCard = document.createElement('div');
        highlightCard.className = 'value-card';
        highlightCard.innerHTML = `
            <div class="highlight-box">
                <h3 class="highlight-title">🏆 NOVEMBRO 2024 (FECHADO)</h3>
                <div class="value-current">${(currentValue / 1000).toFixed(0)}k€</div>
                <div class="value-label">Valor mensal</div>
            </div>
            
            <div class="accumulated-section">
                <h4 class="accumulated-title">ACUMULADO 2024</h4>
                <div class="accumulated-value">5120k€</div>
                <div class="budget-info">Orçamento: 4950k€</div>
                <div class="percentage success">103%</div>
            </div>
        `;
        
        // Second card - Chart and forecast
        const chartCard = document.createElement('div');
        chartCard.className = 'value-card';
        chartCard.innerHTML = `
            <h3 class="accumulated-title">EVOLUÇÃO vs ORÇAMENTO</h3>
            <div class="chart-container">
                <canvas id="financial-chart" width="400" height="256"></canvas>
            </div>
            
            <div class="chart-legend">
                <div class="legend-item">
                    <div class="legend-line legend-dashed"></div>
                    <span>Orçamento</span>
                </div>
                <div class="legend-item">
                    <div class="legend-dot legend-green"></div>
                    <span>Real (Acima)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-dot legend-red"></div>
                    <span>Real (Abaixo)</span>
                </div>
            </div>
            
            <div class="forecast-section">
                <h4 class="forecast-title">PREVISÃO PRÓXIMOS 3 MESES</h4>
                <div class="forecast-item">
                    <span class="forecast-month-label">Dezembro</span>
                    <span class="forecast-amount">535k€</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-month-label">Janeiro</span>
                    <span class="forecast-amount">575k€</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-month-label">Fevereiro</span>
                    <span class="forecast-amount">550k€</span>
                </div>
            </div>
        `;
        
        gridDiv.appendChild(highlightCard);
        gridDiv.appendChild(chartCard);
        valueDiv.appendChild(gridDiv);
        
        container.innerHTML = '';
        container.appendChild(valueDiv);
        
        // Create financial chart
        setTimeout(() => {
            this.createFinancialChart();
        }, 100);
    }
    
    createFinancialChart() {
        const canvas = document.getElementById('financial-chart');
        
        if (canvas && typeof Chart !== 'undefined') {
            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'];
            const actual = [420, 865, 1333, 1785, 2260, 2745, 3207, 3662, 4154, 4632, 5120];
            const budget = [450, 900, 1350, 1800, 2250, 2700, 3150, 3600, 4050, 4500, 4950];
            
            if (this.charts['financial-chart']) {
                this.charts['financial-chart'].destroy();
            }
            
            this.charts['financial-chart'] = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Orçamento',
                            data: budget,
                            borderColor: '#3B82F6',
                            backgroundColor: 'transparent',
                            borderWidth: 3,
                            borderDash: [8, 4],
                            pointBackgroundColor: '#3B82F6',
                            pointRadius: 4,
                            tension: 0
                        },
                        {
                            label: 'Real',
                            data: actual,
                            borderColor: '#10B981',
                            backgroundColor: 'transparent',
                            borderWidth: 3,
                            pointBackgroundColor: actual.map((val, idx) => {
                                return val >= budget[idx] ? '#10B981' : '#EF4444';
                            }),
                            pointRadius: 4,
                            tension: 0
                        }
                    ]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    animation: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: { display: true, color: '#E5E7EB' },
                            ticks: { color: '#6B7280', font: { size: 12 } }
                        },
                        y: {
                            display: true,
                            grid: { display: true, color: '#E5E7EB' },
                            ticks: { color: '#6B7280', font: { size: 12 } }
                        }
                    }
                }
            });
        }
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