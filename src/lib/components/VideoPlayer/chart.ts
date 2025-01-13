import type { Chart, ChartConfiguration } from 'chart.js';
import { VIDEO_PLAYER_CONFIG } from '$lib/constants/index';

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
        borderColor: VIDEO_PLAYER_CONFIG.chartConfig.borderColor,
        backgroundColor: VIDEO_PLAYER_CONFIG.chartConfig.backgroundColor,
        tension: VIDEO_PLAYER_CONFIG.chartConfig.lineTension,
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