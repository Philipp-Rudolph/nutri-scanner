<template>
  <div class="product-dashboard">
    <div class="nutrients-chart">
      <!-- <BarChart :data="chartData" /> -->
    </div>

    <table class="nutrition-table">
      <thead>
        <tr>
          <th>Nährstoff</th>
          <th>Menge pro 100g</th>
          <th>Menge pro Portion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in displayedNutrients" :key="key">
          <td>{{ nutrientLabels[key] || key }}</td>
          <td>{{ value.per100g }} {{ value.unit }}</td>
          <td>{{ value.perServing }} {{ value.unit }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    product: Object,
    data: {
      type: Object as () => Record<string, unknown> | null,
      required: true,
    },
  },
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
.product-dashboard {
  max-width: 600px;
  margin: auto;
  text-align: center;
}
.product-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}
.nutrition-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.nutrition-table th,
.nutrition-table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.nutrients-chart {
  margin: 20px 0;
}
</style>
