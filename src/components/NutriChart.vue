<template>
  <div>
    <h2>Nährwerte Tabelle</h2>

    <table class="nutrition-table" @click="isExpanded = !isExpanded">
      <thead>
        <tr>
          <th>Nährstoff</th>
          <th>Menge pro 100g</th>
          <th>Menge pro Portion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in displayedNutrients" :key="key">
          <th>{{ nutrientLabels[key] || key }}</th>
          <td>{{ value.per100g }} {{ value.unit }}</td>
          <td>{{ value.perServing }} {{ value.unit }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="nutrients-chart">
    <BarChart :chartData="chartData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BarChart from './BarChart.vue'

export default defineComponent({
  props: {
    product: Object,
    data: {
      type: Object as () => Record<string, unknown> | null,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
    }
  },
  components: { BarChart },
  computed: {
    displayedNutrients(): { [key: string]: { per100g: number; perServing: number; unit: string } } {
      const keys = [
        'energy-kcal',
        'carbohydrates',
        'sugars',
        'fat',
        'saturated-fat',
        'proteins',
        'fiber',
        'salt',
      ]
      return keys.reduce(
        (acc: { [key: string]: { per100g: number; perServing: number; unit: string } }, key) => {
          acc[key] = {
            per100g: (this.data?.nutriments as { [key: string]: number })?.[`${key}_100g`],
            perServing: (this.data?.nutriments as { [key: string]: number })?.[`${key}_serving`],
            unit: (this.data?.nutriments as { [key: string]: string })?.[`${key}_unit`],
          }
          return acc
        },
        {},
      )
    },
    chartData(): {
      labels: string[]
      datasets: { label: string; data: number[]; backgroundColor: string }[]
    } {
      console.log('displayedNutrients:', this.displayedNutrients)
      console.log('nutrientLabels:', this.nutrientLabels)

      return {
        labels: Object.keys(this.displayedNutrients).map((key) => this.nutrientLabels[key] || key),
        datasets: [
          {
            label: 'Nährwerte pro 100g',
            data: Object.values(this.displayedNutrients).map((n) => n.per100g),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      }
    },
    nutrientLabels(): { [key: string]: string } {
      return {
        'energy-kcal': 'Energie (kcal)',
        carbohydrates: 'Kohlenhydrate',
        sugars: 'Zucker',
        fat: 'Fett',
        'saturated-fat': 'Gesättigte Fettsäuren',
        proteins: 'Proteine',
        fiber: 'Ballaststoffe',
        salt: 'Salz',
      }
    },
  },
})
</script>

<style>
/* Basis-Styling */
.nutrition-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}

/* Tabellenkopf */
.nutrition-table thead {
  background-color: var(--header-bg);
  color: var(--header-text);
  font-weight: bold;

  & th {
    color: white;
  }
}

.nutrition-table th {
  padding: 12px;
  text-align: left;
  font-size: 1rem;
  border-bottom: 1px solid var(--border-color);
}

/* Tabellenzellen */
.nutrition-table td {
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease-in-out;
}

/* Hover-Effekt für Zeilen */
.nutrition-table tbody tr:hover {
  background-color: var(--hover-bg);
}

/* Alternierende Zeilenfarben */
.nutrition-table tbody tr {
  background-color: var(--row-alt-bg);
}

.nutrition-table th,
.nutrition-table td {
  color: var(--text-color);
}
</style>
