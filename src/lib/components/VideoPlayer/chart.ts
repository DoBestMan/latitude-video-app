import type { Chart, ChartConfiguration } from 'chart.js';
import { CHART_CONFIG } from '$lib/constants';

export function createHeatmapChart(
  canvas: HTMLCanvasElement, 
  data: number[], 
  labels: number[]
): Chart {
  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        fill: true,
        borderColor: CHART_CONFIG.BORDER_COLOR,
        backgroundColor: CHART_CONFIG.BACKGROUND_COLOR,
        tension: CHART_CONFIG.LINE_TENSION,
        pointRadius: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      animation: false,
      interaction: { intersect: false },
      elements: { line: { borderWidth: 2 } },
    },
  };

  return new Chart(canvas, config);
} 