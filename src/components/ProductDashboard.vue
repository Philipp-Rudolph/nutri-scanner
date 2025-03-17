<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="spacer"></div>
      <h2>{{ product.name }}</h2>
      <button @click="$emit('close')" class="close-button">
        <div class="line"></div>
        <div class="line"></div>
      </button>
    </header>

    <div class="dashboard-body">
      <img :src="product.image" :alt="product.name" class="product-image" />

      <section class="nutriscore-explanation">
        <h3>Was ist der Nutri-Score?</h3>
        <p>
          Der Nutri-Score bewertet Lebensmittel von
          <span class="score score-a">A</span> (gesündeste) bis
          <span class="score score-e">E</span> (ungesündeste) anhand von Nährstoffwerten.
        </p>
        <div class="nutriscore-scale">
          <span
            v-for="score in ['A', 'B', 'C', 'D', 'E']"
            :key="score"
            :class="`score score-${score.toLowerCase()}`"
          >
            {{ score }}
          </span>
        </div>
      </section>

      <section v-if="hasNutriScore" class="nutriscore">
        <h2>
          Nutri-Score:
          <span :class="nutriScoreClass">{{ product.nutriscore?.grade.toUpperCase() }}</span>
        </h2>

        <div class="nutriscore-table-container">
          <table class="nutriscore-table">
            <thead>
              <tr>
                <th>Komponente</th>
                <th>Wert</th>
                <th>Auswirkung</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="comp in product.nutriscore?.components.negative" :key="comp.id">
                <tr class="negative-row">
                  <th>{{ formatKey(comp.id) }}</th>
                  <td>{{ comp.value }}{{ comp.unit }}</td>
                  <td class="negative">-{{ comp.points }} Punkte</td>
                </tr>
              </template>
              <template v-for="comp in product.nutriscore?.components.positive" :key="comp.id">
                <tr class="positive-row">
                  <th>{{ formatKey(comp.id) }}</th>
                  <td>{{ comp.value ?? 'N/A' }}{{ comp.unit }}</td>
                  <td class="positive">+{{ comp.points }} Punkte</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <p class="final-score">
          <strong>Endgültige Punktzahl:</strong> {{ product.nutriscore?.score ?? 'N/A' }}
        </p>
      </section>

      <p v-else>
        Keine Nutri-Score Daten verfügbar für <strong>{{ product.name }}</strong>
      </p>

      <section class="learn-more">
        <h3 @click="isExpanded = !isExpanded" class="component-title">
          Wie wird der Nutri-Score berechnet?
        </h3>
        <transition name="fade">
          <div v-if="isExpanded" class="explanation">
            <p>Die Punktzahl berechnet sich aus:</p>
            <div class="score-grid">
              <span
                v-for="item in scoreItems"
                :key="item.text"
                :class="`score-item ${item.class}`"
                >{{ item.text }}</span
              >
            </div>
            <p>
              <strong>Gesamtpunktzahl</strong> = Punkte für ungünstige Inhaltsstoffe − Punkte für
              günstige Inhaltsstoffe
            </p>
            <p>Je niedriger die Punktzahl, desto besser die Nährwertqualität.</p>
          </div>
        </transition>
      </section>

      <NutriChart :product="product" :data="data" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NutriChart from './NutriChart.vue'
import { type Product } from '@/types/product'
import { type PropType } from 'vue'

export default defineComponent({
  components: { NutriChart },
  props: {
    product: { type: Object as PropType<Product>, required: true },
    data: { type: Object, required: true },
  },
  data() {
    return { isExpanded: false }
  },
  computed: {
    hasNutriScore(): boolean {
      return !!this.product.nutriscore && Object.keys(this.product.nutriscore).length > 0
    },
    nutriScoreClass(): string {
      const grade = this.product.nutriscore?.grade?.toUpperCase()
      return grade ? `score score-${grade.toLowerCase()}` : ''
    },
    scoreItems(): { text: string; class: string }[] {
      return [
        { text: 'Gesättigte Fettsäuren', class: 'score-e' },
        { text: 'Salz & Zucker', class: 'score-e' },
        { text: 'Kalorien', class: 'score-e' },
        { text: 'Ballaststoffe', class: 'score-a' },
        { text: 'Proteine', class: 'score-a' },
        { text: 'Obst & Gemüse', class: 'score-a' },
      ]
    },
  },
  methods: {
    formatKey(key: string): string {
      const translations: Record<string, string> = {
        energy: 'Energie',
        sugars: 'Zucker',
        saturated_fat: 'Gesättigte Fettsäuren',
        salt: 'Salz',
        non_nutritive_sweeteners: 'Süßstoffe',
        proteins: 'Proteine',
        fiber: 'Ballaststoffe',
        fruits_vegetables_legumes: 'Obst, Gemüse & Hülsenfrüchte',
      }
      return translations[key] || key
    },
  },
})
</script>

<style scoped>
.dashboard {
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  margin: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: justify;

  /* remove scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--color-background);
  color: var(--color-text);
  position: sticky;
  top: 0;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #ddd;

  .close-button {
    border: none;
    background: none;
    cursor: pointer;
    height: 50px;
    width: 50px;
  }
  .spacer {
    height: 50px;
    width: 50px;
  }
}

.dashboard-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  & > * {
    border-bottom: 1px solid #ddd;
    padding-bottom: 2rem;
  }
}

h2,
h3 {
  text-align: center;
}

.product-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: contain;
}

.nutriscore {
  h2 {
    border-bottom: 1px solid #ddd;
    padding-bottom: 2rem;
  }
}

.nutriscore-scale,
.score-grid {
  font-weight: bold;
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 10px;
  justify-content: center;
  margin: 10px 0;

  @media screen and (min-width: 600px) {
    grid-template-columns: repeat(3, auto);
  }
}

.score-item {
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 1rem;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.score-item:hover {
  transform: scale(1.05);
}

/* Nutri-Score Scale */
.nutriscore-scale {
  display: flex;
  justify-content: center;
  gap: 8px;
  font-weight: bold;
  margin-top: 10px;
}

.score {
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.score:hover {
  transform: scale(1.1);
}

.score-a {
  background: #008000;
  color: white;
}
.score-b {
  background: #80c000;
  color: white;
}
.score-c {
  background: #ffc000;
  color: white;
}
.score-d {
  background: #ff8000;
  color: white;
}
.score-e {
  background: #e00000;
  color: white;
}

.nutriscore-table-container {
  overflow-x: auto;
}

.nutriscore-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 400px;
}
.nutriscore-table th,
.nutriscore-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}

.negative-row {
  background: rgba(255, 77, 77, 0.1);
}
.negative-row:hover {
  background: rgba(255, 77, 77, 0.5);
}
.positive-row {
  background: rgba(77, 255, 77, 0.1);
}
.positive-row:hover {
  background: rgba(77, 255, 77, 0.5);
}
.negative {
  color: red;
}
.positive {
  color: green;
}

.final-score {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  border-top: 1px solid #ddd;
  padding-top: 15px;
}

.component-title {
  cursor: pointer;
  color: #007bff;
  transition: color 0.2s;
}
.component-title:hover {
  color: #0056b3;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.line {
  width: 30px;
  height: 1px;
  background: var(--color-text);
}
.line:first-child {
  transform: rotate(45deg);
}
.line:last-child {
  transform: rotate(-45deg);
}

h3 {
  margin-bottom: 1rem;
}
</style>
