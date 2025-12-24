let myChart = null;

const inputs = ['chart-title', 'chart-type', 'chart-data'];
inputs.forEach(id => {
  document.getElementById(id).addEventListener('input', updateChart);
});

function parseData(text) {
  const lines = text.split('\n').filter(l => l.includes(':'));
  const labels = [];
  const values = [];

  lines.forEach(line => {
    const [label, val] = line.split(':');
    labels.push(label.trim());
    values.push(parseFloat(val.trim()) || 0);
  });

  return { labels, values };
}

function updateChart() {
  const title = document.getElementById('chart-title').value;
  const type = document.getElementById('chart-type').value;
  const rawData = document.getElementById('chart-data').value;
  const { labels, values } = parseData(rawData);

  const ctx = document.getElementById('myChart');

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: type !== 'bar' && type !== 'line'
        }
      }
    }
  });
}

// Wait for Chart.js to load
const checkLoaded = setInterval(() => {
  if (window.Chart) {
    clearInterval(checkLoaded);
    updateChart();
  }
}, 100);
