// Global data
let dashboardData = {
  totalProdutos: 1250,
  quantidadeTotal: 45780,
  valorTotal: 2345680.50,
  produtosAtivos: 1182,
  estoqueCategoria: {
    'Eletrônicos': 12850,
    'Informática': 9860,
    'Escritório': 7950,
    'Limpeza': 5620,
    'Utilidades': 4380,
    'Outros': 5120
  },
  estoquePorStatus: {
    'Estoque Normal': 992,
    'Estoque Baixo': 198,
    'Sem Estoque': 60
  },
  movimentacoes: {
    meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
    entradas: [4200, 5800, 7200, 6500, 8500],
    saidas: [3800, 4200, 5500, 4800, 6200]
  },
  alertas: {
    estoqueBaixo: 198,
    semEstoque: 60,
    proximoVencimento: 32
  },
  topProdutos: [
    { produto: 'Monitor 24" LED Dell', categoria: 'Informática', quantidade: 320, valor: 102400 },
    { produto: 'Notebook Lenovo ThinkPad', categoria: 'Informática', quantidade: 150, valor: 96750 },
    { produto: 'Impressora Multifuncional HP', categoria: 'Informática', quantidade: 210, valor: 63000 },
    { produto: 'Smartphone Samsung Galaxy', categoria: 'Eletrônicos', quantidade: 180, valor: 54000 },
    { produto: 'Cadeira Escritório Executiva', categoria: 'Escritório', quantidade: 95, valor: 47500 }
  ],
  ultimasMovimentacoes: [
    { data: '23/05/2025 10:30', tipo: 'Entrada', documento: 'NF 12548', produto: 'Monitor 24" LED Dell', categoria: 'Informática', quantidade: 20, valorUnitario: 1280, valorTotal: 25600, responsavel: 'João Silva' },
    { data: '23/05/2025 09:15', tipo: 'Saída', documento: 'OS 9875', produto: 'Teclado Mecânico Logitech', categoria: 'Informática', quantidade: 5, valorUnitario: 350, valorTotal: 1750, responsavel: 'Maria Santos' },
    { data: '22/05/2025 16:45', tipo: 'Entrada', documento: 'NF 12547', produto: 'Cadeira Escritório Executiva', categoria: 'Escritório', quantidade: 15, valorUnitario: 500, valorTotal: 7500, responsavel: 'João Silva' },
    { data: '22/05/2025 14:20', tipo: 'Saída', documento: 'OS 9874', produto: 'Impressora Multifuncional HP', categoria: 'Informática', quantidade: 2, valorUnitario: 1200, valorTotal: 2400, responsavel: 'Pedro Almeida' },
    { data: '22/05/2025 11:05', tipo: 'Entrada', documento: 'NF 12546', produto: 'Papel A4 500 folhas', categoria: 'Escritório', quantidade: 50, valorUnitario: 25, valorTotal: 1250, responsavel: 'Maria Santos' }
  ]
};

// Chart instances
let categoryChart, movementChart, statusChart;

// Chart colors
const chartColors = {
  blue: '#3b82f6',
  green: '#22c55e',
  orange: '#f97316',
  purple: '#a855f7',
  cyan: '#06b6d4',
  yellow: '#eab308',
  red: '#ef4444',
  gray: '#64748b'
};

const categoryColors = [
  chartColors.blue,
  chartColors.orange,
  chartColors.green,
  chartColors.gray,
  chartColors.cyan,
  chartColors.purple
];

const statusColors = [
  chartColors.green,
  chartColors.orange,
  chartColors.red
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  // Load saved data from localStorage
  loadFromLocalStorage();
  
  // Initialize dashboard
  updateDashboard();
  initCharts();
  
  // Set current date
  updateCurrentDate();
  
  // Setup file input
  setupFileInput();
});

// Update current date
function updateCurrentDate() {
  const now = new Date();
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dateStr = `${now.getDate()} de ${months[now.getMonth()]}, ${now.getFullYear()}`;
  document.getElementById('currentDate').textContent = dateStr;
}

// Format number with thousands separator
function formatNumber(num) {
  return num.toLocaleString('pt-BR');
}

// Format currency
function formatCurrency(num) {
  return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Update dashboard values
function updateDashboard() {
  // Update stat cards
  document.getElementById('totalProdutos').textContent = formatNumber(dashboardData.totalProdutos);
  document.getElementById('quantidadeTotal').textContent = formatNumber(dashboardData.quantidadeTotal);
  document.getElementById('valorTotal').textContent = formatCurrency(dashboardData.valorTotal);
  document.getElementById('produtosAtivos').textContent = formatNumber(dashboardData.produtosAtivos);
  
  // Update donut centers
  document.getElementById('donutTotal').textContent = formatNumber(dashboardData.quantidadeTotal);
  document.getElementById('statusDonutTotal').textContent = formatNumber(dashboardData.totalProdutos);
  
  // Update progress bar
  const progressPercent = (dashboardData.produtosAtivos / dashboardData.totalProdutos * 100).toFixed(1);
  document.querySelector('.progress-info span').textContent = `${progressPercent}% do total`;
  document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
  
  // Update alerts
  document.getElementById('alertBaixo').textContent = `${dashboardData.alertas.estoqueBaixo} produtos com estoque baixo`;
  document.getElementById('alertSemEstoque').textContent = `${dashboardData.alertas.semEstoque} produtos sem estoque`;
  document.getElementById('alertVencimento').textContent = `${dashboardData.alertas.proximoVencimento} produtos próximos do vencimento`;
  
  // Update top products table
  updateTopProductsTable();
  
  // Update movements table
  updateMovementsTable();
}

// Update top products table
function updateTopProductsTable() {
  const tbody = document.getElementById('topProductsTable');
  tbody.innerHTML = '';
  
  dashboardData.topProdutos.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.produto}</td>
      <td>${item.categoria}</td>
      <td>${formatNumber(item.quantidade)}</td>
      <td>${formatCurrency(item.valor)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Update movements table
function updateMovementsTable() {
  const tbody = document.getElementById('movementsTable');
  tbody.innerHTML = '';
  
  dashboardData.ultimasMovimentacoes.forEach(item => {
    const tr = document.createElement('tr');
    const badgeClass = item.tipo.toLowerCase() === 'entrada' ? 'entrada' : 'saida';
    tr.innerHTML = `
      <td>${item.data}</td>
      <td><span class="badge ${badgeClass}">${item.tipo}</span></td>
      <td>${item.documento}</td>
      <td>${item.produto}</td>
      <td>${item.categoria}</td>
      <td>${item.quantidade}</td>
      <td>${formatCurrency(item.valorUnitario)}</td>
      <td>${formatCurrency(item.valorTotal)}</td>
      <td>${item.responsavel}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Initialize charts
function initCharts() {
  initCategoryChart();
  initMovementChart();
  initStatusChart();
}

// Category donut chart
function initCategoryChart() {
  const ctx = document.getElementById('categoryChart').getContext('2d');
  const labels = Object.keys(dashboardData.estoqueCategoria);
  const data = Object.values(dashboardData.estoqueCategoria);
  const total = data.reduce((a, b) => a + b, 0);
  
  // Update legend
  const legendContainer = document.getElementById('categoryLegend');
  legendContainer.innerHTML = '';
  labels.forEach((label, index) => {
    const percentage = ((data[index] / total) * 100).toFixed(1);
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <span class="legend-dot" style="background: ${categoryColors[index]}"></span>
      <span>${label}</span>
      <span style="margin-left: auto; color: var(--text-primary)">${formatNumber(data[index])} (${percentage}%)</span>
    `;
    legendContainer.appendChild(legendItem);
  });
  
  if (categoryChart) {
    categoryChart.destroy();
  }
  
  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: categoryColors,
        borderColor: '#1e293b',
        borderWidth: 3,
        hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f8fafc',
          bodyColor: '#94a3b8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${formatNumber(value)} unidades (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Movement line chart
function initMovementChart() {
  const ctx = document.getElementById('movementChart').getContext('2d');
  
  if (movementChart) {
    movementChart.destroy();
  }
  
  movementChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dashboardData.movimentacoes.meses,
      datasets: [
        {
          label: 'Entradas',
          data: dashboardData.movimentacoes.entradas,
          borderColor: chartColors.green,
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: chartColors.green,
          pointBorderColor: '#1e293b',
          pointBorderWidth: 2,
          pointHoverRadius: 6
        },
        {
          label: 'Saídas',
          data: dashboardData.movimentacoes.saidas,
          borderColor: chartColors.red,
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: chartColors.red,
          pointBorderColor: '#1e293b',
          pointBorderWidth: 2,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f8fafc',
          bodyColor: '#94a3b8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${formatNumber(context.raw)} unidades`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(51, 65, 85, 0.3)',
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            font: {
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(51, 65, 85, 0.3)',
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            font: {
              size: 11
            },
            callback: function(value) {
              if (value >= 1000) {
                return (value / 1000) + 'K';
              }
              return value;
            }
          },
          beginAtZero: true
        }
      }
    }
  });
}

// Status donut chart
function initStatusChart() {
  const ctx = document.getElementById('statusChart').getContext('2d');
  const labels = Object.keys(dashboardData.estoquePorStatus);
  const data = Object.values(dashboardData.estoquePorStatus);
  const total = data.reduce((a, b) => a + b, 0);
  
  // Update legend
  const legendContainer = document.getElementById('statusLegend');
  legendContainer.innerHTML = '';
  labels.forEach((label, index) => {
    const percentage = ((data[index] / total) * 100).toFixed(1);
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <span class="legend-dot" style="background: ${statusColors[index]}"></span>
      <span>${label}</span>
      <span style="margin-left: auto; color: var(--text-primary)">${formatNumber(data[index])} (${percentage}%)</span>
    `;
    legendContainer.appendChild(legendItem);
  });
  
  if (statusChart) {
    statusChart.destroy();
  }
  
  statusChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: statusColors,
        borderColor: '#1e293b',
        borderWidth: 3,
        hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f8fafc',
          bodyColor: '#94a3b8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${formatNumber(value)} produtos (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Setup file input for Excel import
function setupFileInput() {
  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', handleFileUpload);
}

// Handle Excel file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      
      if (jsonData.length > 0) {
        processExcelData(jsonData);
        saveToLocalStorage();
        alert('Planilha importada com sucesso! ' + jsonData.length + ' registros processados.');
      } else {
        alert('A planilha está vazia ou não foi possível ler os dados.');
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      alert('Erro ao processar o arquivo. Verifique se é um arquivo Excel válido.');
    }
  };
  
  reader.readAsArrayBuffer(file);
  // Reset input
  event.target.value = '';
}

// Process Excel data
function processExcelData(data) {
  // Map column names (case insensitive)
  const columnMap = {};
  const firstRow = data[0];
  
  for (const key in firstRow) {
    const lowerKey = key.toLowerCase().trim();
    
    if (lowerKey.includes('produto') || lowerKey.includes('nome') || lowerKey.includes('descri')) {
      columnMap.produto = key;
    }
    if (lowerKey.includes('categoria') || lowerKey.includes('tipo') || lowerKey.includes('grupo')) {
      columnMap.categoria = key;
    }
    if (lowerKey.includes('estoque') && (lowerKey.includes('atual') || lowerKey.includes('qtd') || lowerKey.includes('quantidade'))) {
      columnMap.estoqueAtual = key;
    }
    if (lowerKey.includes('mínimo') || lowerKey.includes('minimo') || lowerKey.includes('min')) {
      columnMap.estoqueMinimo = key;
    }
    if (lowerKey.includes('máximo') || lowerKey.includes('maximo') || lowerKey.includes('max')) {
      columnMap.estoqueMaximo = key;
    }
    if (lowerKey.includes('valor') && (lowerKey.includes('estoque') || lowerKey.includes('total'))) {
      columnMap.valorEstoque = key;
    }
    if (lowerKey.includes('status') || lowerKey.includes('situação') || lowerKey.includes('situacao')) {
      columnMap.status = key;
    }
    if (lowerKey.includes('fornecedor')) {
      columnMap.fornecedor = key;
    }
    if (lowerKey.includes('entrada') || lowerKey.includes('data')) {
      columnMap.dataEntrada = key;
    }
    if (lowerKey.includes('moviment') || lowerKey.includes('última') || lowerKey.includes('ultima')) {
      columnMap.ultimaMovimentacao = key;
    }
    // Additional mappings for simple column names
    if (lowerKey === 'quantidade' || lowerKey === 'qtd' || lowerKey === 'qty') {
      columnMap.estoqueAtual = key;
    }
    if (lowerKey === 'valor' || lowerKey === 'preço' || lowerKey === 'preco' || lowerKey === 'price') {
      columnMap.valorEstoque = key;
    }
  }
  
  // Calculate stats
  let totalProdutos = data.length;
  let quantidadeTotal = 0;
  let valorTotal = 0;
  let produtosAtivos = 0;
  
  const categorias = {};
  const statusCount = {
    'Estoque Normal': 0,
    'Estoque Baixo': 0,
    'Sem Estoque': 0
  };
  
  const produtos = [];
  
  data.forEach(row => {
    const quantidade = parseFloat(row[columnMap.estoqueAtual]) || 0;
    const valor = parseFloat(row[columnMap.valorEstoque]) || 0;
    const categoria = row[columnMap.categoria] || 'Outros';
    const estoqueMinimo = parseFloat(row[columnMap.estoqueMinimo]) || 10;
    
    quantidadeTotal += quantidade;
    valorTotal += valor;
    
    // Category aggregation
    if (!categorias[categoria]) {
      categorias[categoria] = 0;
    }
    categorias[categoria] += quantidade;
    
    // Status calculation
    const status = String(row[columnMap.status] || '').trim().toLowerCase();

if (quantidade <= 0) {
  statusCount['Sem Estoque']++;
}
else if (status.includes('baixo')) {
  statusCount['Estoque Baixo']++;
}
else {
  statusCount['Estoque Normal']++;
}

if (status.includes('ativo')) {
  produtosAtivos++;
}
    
    // Collect product data
    produtos.push({
      produto: row[columnMap.produto] || 'Produto sem nome',
      categoria: categoria,
      quantidade: quantidade,
      valor: valor
    });
  });
  
  // Update dashboard data
  dashboardData.totalProdutos = totalProdutos;
  dashboardData.quantidadeTotal = quantidadeTotal;
  dashboardData.valorTotal = valorTotal;
  dashboardData.produtosAtivos = produtosAtivos;
  dashboardData.estoqueCategoria = categorias;
  dashboardData.estoquePorStatus = statusCount;
  
  // Update alerts
  dashboardData.alertas.estoqueBaixo = statusCount['Estoque Baixo'];
  dashboardData.alertas.semEstoque = statusCount['Sem Estoque'];
  
  // Sort and get top 5 products by value
  produtos.sort((a, b) => b.valor - a.valor);
  dashboardData.topProdutos = produtos.slice(0, 5);
  
  // Update UI
  updateDashboard();
  initCharts();
}

// Save to localStorage
function saveToLocalStorage() {
  try {
    localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
}

// Load from localStorage
function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('dashboardData');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure all properties exist
      dashboardData = { ...dashboardData, ...parsed };
    }
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error);
  }
}
