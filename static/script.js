// Chart objects to store references
let salesChart = null;
let weeklyChart = null;
let trendChart = null;

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', function () {
  displayCurrentDate();
  initializeCharts();
  setupDateListeners();
});

// Display the current date in the header
function displayCurrentDate() {
  const dateElement = document.getElementById('current-date');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString('en-US', options);
  dateElement.textContent = currentDate;
  
  // Set default start date to today
  const today = new Date();
  const formattedDate = formatDateForInput(today);
  document.getElementById('start-date').value = formattedDate;
  
  // Update date range display
  updateDateRangeDisplay();
}

// Format date for input field (YYYY-MM-DD)
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Setup listeners for date and weeks inputs
function setupDateListeners() {
  document.getElementById('start-date').addEventListener('change', updateDateRangeDisplay);
  document.getElementById('weeks').addEventListener('change', updateDateRangeDisplay);
  document.getElementById('weeks').addEventListener('input', updateDateRangeDisplay);
}

// Update the date range display
function updateDateRangeDisplay() {
  const startDateInput = document.getElementById('start-date').value;
  const weeksInput = document.getElementById('weeks').value;
  
  if (!startDateInput || !weeksInput) {
    document.getElementById('date-range-text').textContent = 'Select a start date and number of weeks';
    return;
  }
  
  const startDate = new Date(startDateInput);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (parseInt(weeksInput) * 7) - 1);
  
  const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  document.getElementById('date-range-text').textContent = `${startFormatted} to ${endFormatted}`;
}

// Initialize empty charts
function initializeCharts() {
  // Initialize main sales chart (bar chart for weekly sales)
  const salesCtx = document.getElementById('sales-chart').getContext('2d');
  salesChart = new Chart(salesCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Weekly Sales Forecast',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sales Amount'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Week'
          }
        }
      }
    }
  });

  // Initialize weekly comparison chart
  const weeklyCtx = document.getElementById('weekly-chart').getContext('2d');
  weeklyChart = new Chart(weeklyCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Weekly Sales',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Sales'
          }
        }
      }
    }
  });

  // Initialize trend chart
  const trendCtx = document.getElementById('trend-chart').getContext('2d');
  trendChart = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Weekly Sales Trend',
        data: [],
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sales Amount'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Week'
          }
        }
      }
    }
  });
}

// Get forecast data from the server
function getForecast() {
  const storeInput = document.getElementById('store').value;
  const startDateInput = document.getElementById('start-date').value;
  const weeksInput = document.getElementById('weeks').value;
  
  if (!startDateInput || !weeksInput) {
    alert('Please select a start date and number of weeks');
    return;
  }
  
  if (!storeInput) {
    alert('Please enter a store identifier');
    return;
  }
  
  const startDate = new Date(startDateInput);
  
  // Common forecast parameters
  const commonParams = {
    store: storeInput,
    start_date: startDateInput,
    weeks: weeksInput,
    temperature: document.getElementById('temperature').value,
    fuel_price: document.getElementById('fuel_price').value,
    cpi: document.getElementById('cpi').value,
    unemployment: document.getElementById('unemployment').value,
    holiday_flag: document.getElementById('holiday_flag').value
  };
  
  // Basic validation for common parameters
  for (let key in commonParams) {
    if (!commonParams[key]) {
      alert(`Please enter a value for ${key.replace('_', ' ')}`);
      return;
    }
  }

  // Show loading state
  const tbody = document.getElementById('forecast-body');
  tbody.innerHTML = `<tr><td colspan="3">Loading forecast...</td></tr>`;

  // In a real implementation, you would send the request to the server
  // For now, we'll simulate the response with weekly data
  
  // Simulate API call delay
  setTimeout(() => {
    // Generate simulated forecast data for each week
    const forecastData = generateSimulatedWeeklyForecastData(parseInt(weeksInput), commonParams);
    
    // Update the UI with the forecast data
    updateUIWithWeeklyForecastData(forecastData);
  }, 1000);
}

// Generate simulated forecast data for each week
function generateSimulatedWeeklyForecastData(numWeeks, params) {
  // Convert params to numbers
  const temperature = parseFloat(params.temperature);
  const fuelPrice = parseFloat(params.fuel_price);
  const cpi = parseFloat(params.cpi);
  const unemployment = parseFloat(params.unemployment);
  const holidayFlag = parseInt(params.holiday_flag);
  const startDate = new Date(params.start_date);
  
  // Base value for sales - this would come from your ML model in reality
  // Ensure base sales is positive
  const baseSales = Math.abs(50000 + (temperature * 100) - (fuelPrice * 1000) + (cpi * 10) - (unemployment * 2000));
  
  // Generate data for each week
  const weeklyData = [];
  
  for (let i = 0; i < numWeeks; i++) {
    // Calculate week start and end dates
    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + (i * 7));
    
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);
    
    // Format dates
    const weekStartFormatted = weekStartDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
    
    const weekEndFormatted = weekEndDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // Random variation (±15%)
    const randomVariation = 0.85 + (Math.random() * 0.3);
    
    // Holiday boost
    const holidayMultiplier = holidayFlag === 1 ? 1.2 : 1.0;
    
    // Seasonal trend (higher in later weeks)
    const seasonalTrend = 1 + (i * 0.03);
    
    // Calculate sales for this week - ensure it's positive
    const sales = Math.abs(baseSales * randomVariation * holidayMultiplier * seasonalTrend);
    
    weeklyData.push({
      weekNumber: i + 1,
      startDate: weekStartDate,
      endDate: weekEndDate,
      dateRange: `${weekStartFormatted} - ${weekEndFormatted}`,
      sales: sales
    });
  }
  
  return weeklyData;
}

// Update UI with weekly forecast data
function updateUIWithWeeklyForecastData(forecastData) {
  // Update table
  updateWeeklyForecastTable(forecastData);
  
  // Update summary stats
  updateWeeklySummaryStats(forecastData);
  
  // Update charts
  updateWeeklyCharts(forecastData);
}

// Update the forecast table with weekly data
function updateWeeklyForecastTable(forecastData) {
  const tbody = document.getElementById('forecast-body');
  tbody.innerHTML = '';
  
  forecastData.forEach(week => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>Week ${week.weekNumber}</td>
      <td>${week.dateRange}</td>
      <td>${formatNumber(week.sales)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Update summary stats for weekly data
function updateWeeklySummaryStats(forecastData) {
  // Calculate total and average sales
  const totalSales = forecastData.reduce((sum, week) => sum + week.sales, 0);
  const avgSales = totalSales / forecastData.length;
  
  // Find min and max sales weeks
  const minSalesWeek = forecastData.reduce((min, week) => week.sales < min.sales ? week : min, forecastData[0]);
  const maxSalesWeek = forecastData.reduce((max, week) => week.sales > max.sales ? week : max, forecastData[0]);
  
  // Get store name
  const storeName = document.getElementById('store').value;
  
  // Update the summary stats
  document.getElementById('summary-stats').innerHTML = `
    <div class="stat-item">
      <span class="stat-label">Store:</span>
      <span class="stat-value">${storeName}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Total Forecast:</span>
      <span class="stat-value">${formatNumber(totalSales)}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Weekly Average:</span>
      <span class="stat-value">${formatNumber(avgSales)}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Peak Week:</span>
      <span class="stat-value">Week ${maxSalesWeek.weekNumber} (${formatNumber(maxSalesWeek.sales)})</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Lowest Week:</span>
      <span class="stat-value">Week ${minSalesWeek.weekNumber} (${formatNumber(minSalesWeek.sales)})</span>
    </div>
  `;
}

// Update all charts with weekly forecast data
function updateWeeklyCharts(forecastData) {
  // Prepare data for weekly sales chart
  const labels = forecastData.map(week => `Week ${week.weekNumber}`);
  const salesData = forecastData.map(week => week.sales);
  
  // Update weekly sales chart
  salesChart.data.labels = labels;
  salesChart.data.datasets[0].data = salesData;
  salesChart.update();
  
  // Update weekly comparison chart
  weeklyChart.data.labels = labels;
  weeklyChart.data.datasets[0].data = salesData;
  weeklyChart.update();
  
  // Update trend chart
  trendChart.data.labels = labels;
  trendChart.data.datasets[0].data = salesData;
  trendChart.update();
}

// Helper function to format numbers
function formatNumber(number) {
  return parseFloat(number).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}