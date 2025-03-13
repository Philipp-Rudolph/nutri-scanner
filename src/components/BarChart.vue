<template>
  <h2>Nährwerte Übersicht</h2>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  type ChartData,
} from 'chart.js'
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip)
Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip)

export default defineComponent({
  props: {
    chartData: {
      type: Object as () => ChartData, // 🎯 Typ für Chart-Objekt
      required: true,
    }, // Erwartet das formatierte Chart-Objekt
  },
  setup(props) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null

    const createChart = async () => {
      await nextTick()
      console.log('Creating chart with data:', chartCanvas.value)
      if (!chartCanvas.value || !props.chartData || Object.keys(props.chartData).length === 0) {
        console.warn('Chart-Daten fehlen oder sind leer:', props.chartData)
        return
      }

      if (chartInstance) {
        chartInstance.destroy()
      }

      chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: props.chartData, // 🎯 Direkt das übergebene Chart-Objekt nutzen!
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => `${context.raw} g`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    }

    // Erstelle das Chart, wenn sich `chartData` ändert
    watch(() => props.chartData, createChart, { deep: true, immediate: true })

    return { chartCanvas }
  },
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}
</style>
