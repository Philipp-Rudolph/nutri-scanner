<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip)

export default defineComponent({
  props: {
    nutriments: Object, // Erwartet ein Objekt mit den Nährwerten
  },
  setup(props) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null

    const createChart = () => {
      if (!chartCanvas.value || !props.nutriments) return

      if (chartInstance) {
        chartInstance.destroy()
      }

      chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
          labels: [
            'Energie (kcal)',
            'Kohlenhydrate',
            'Zucker',
            'Fett',
            'Proteine',
            'Ballaststoffe',
            'Salz',
          ],
          datasets: [
            {
              label: 'Nährwerte pro 100g',
              data: [
                props.nutriments['energy-kcal_100g'],
                props.nutriments['carbohydrates_100g'],
                props.nutriments['sugars_100g'],
                props.nutriments['fat_100g'],
                props.nutriments['proteins_100g'],
                props.nutriments['fiber_100g'],
                props.nutriments['salt_100g'],
              ],
              backgroundColor: [
                '#ffcc00',
                '#ff6666',
                '#ff9999',
                '#ffcc99',
                '#99ccff',
                '#99ff99',
                '#cccccc',
              ],
              borderWidth: 1,
            },
          ],
        },
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

    onMounted(createChart)
    watch(() => props.nutriments, createChart, { deep: true })

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
