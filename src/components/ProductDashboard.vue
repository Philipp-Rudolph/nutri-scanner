<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="spacer"></div>
      <h2>{{ product.name }}</h2>
      <button @click="$emit('close')" class="close-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="close-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <img :src="product.image" :alt="product.name" class="product-image" />
    <!-- Nutri-Score Erklärung -->
    <div class="nutriscore-explanation">
      <h3>Was ist der Nutri-Score?</h3>
      <p>
        Der Nutri-Score ist ein Bewertungssystem, das Lebensmittel von
        <span class="score score-a">A</span> (Gesündeste) bis
        <span class="score score-e">E</span> (Ungesündeste) klassifiziert. Es basiert auf
        Nährstoffen, die zu begrenzen sind (Zucker, gesättigte Fettsäuren, Salz, Kalorien) und
        Nährstoffen, die zu bevorzugen sind (Ballaststoffe, Proteine, Obst und Gemüse).
      </p>

      <!-- Visuelle Nutri-Score-Skala -->
      <div class="nutriscore-scale">
        <span class="score score-a">A</span>
        <span class="score score-b">B</span>
        <span class="score score-c">C</span>
        <span class="score score-d">D</span>
        <span class="score score-e">E</span>
      </div>
    </div>

    <!-- Nutri-Score Bewertung -->
    <div v-if="product.nutriscore && Object.keys(product.nutriscore).length > 0" class="nutriscore">
      <div class="nutriscore">
        <h3 class="nutriscore-title">
          Nutri-Score:
          <span :class="nutriScoreClass">{{
            product.nutriscore.grade ? product.nutriscore.grade.toUpperCase() : 'unknown'
          }}</span>
        </h3>
      </div>

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
            <tr
              v-for="neg in product.nutriscore.components.negative"
              :key="neg.id"
              class="negative-row"
            >
              <td>{{ neg.id }}</td>
              <td>{{ neg.value }}{{ neg.unit }}</td>
              <td class="negative">-{{ neg.points }} Punkte</td>
            </tr>
            <tr
              v-for="pos in product.nutriscore.components.positive"
              :key="pos.id"
              class="positive-row"
            >
              <td>{{ pos.id }}</td>
              <td>{{ pos.value !== null ? pos.value : 'N/A' }}{{ pos.unit }}</td>
              <td class="positive">+{{ pos.points }} Punkte</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="final-score">
        <strong>Endgültige Punktzahl:</strong> {{ product.nutriscore.score }}
      </p>
    </div>

    <div v-else>
      Keine Nutri-Score Daten verfügbar für <strong>{{ product.name }}</strong>
    </div>

    <!-- Mehr erfahren -->
    <div class="learn-more">
      <h3 class="component-title" @click="isExpanded = !isExpanded">
        Wie wird der Nutri-Score berechnet?
      </h3>
      <transition name="fade">
        <div v-if="isExpanded" class="explanation">
          <p>Die Punktzahl wird anhand negativer und positiver Faktoren berechnet:</p>

          <div class="score-grid">
            <div class="score-item score-e">Gesättigte Fettsäuren</div>
            <div class="score-item score-e">Salz & Zucker</div>
            <div class="score-item score-e">Kalorien (höher ist schlechter)</div>
            <div class="score-item score-a">Ballaststoffe</div>
            <div class="score-item score-a">Proteine</div>
            <div class="score-item score-a">Obst & Gemüse (höher ist besser)</div>
          </div>

          <p>
            <br />
            Zur Berechnung der Gesamtpunktzahl werden die Punkte der günstigen Inhaltsstoffe von der
            Punktezahl der ungünstigen abgezogen. Die Punktezahl ergibt dann den entsprechenden
            Buchstaben in der Farbscala.
          </p>
          <br />
          <p>
            <strong>Gesamtpunktzahl</strong> = Punkte für weniger erwünschte Inhaltsstoffe − Punkte
            für erwünschte Inhaltsstoffe
          </p>

          <p>
            <br />Hierbei gilt: Je geringer die Gesamtpunktezahl, umso höher ist die
            Nährwertqualität des Lebensmittels
          </p>
          <br />
          <h3 @click="showRawData = !showRawData">
            JSON-Daten {{ showRawData ? 'einklappen' : 'anzeigen' }}
          </h3>
          <pre v-if="showRawData"><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
        </div>
      </transition>
    </div>
    <!-- <BarChart :nutriments="data.nutriments" /> -->
    <NutriChart :product="product" :data="data" />
  </div>
</template>

<script lang="ts">
import NutriChart from './NutriChart.vue'

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
    data: {
      type: Object as () => Record<string, unknown> | null,
      required: true,
    },
  },
  components: { NutriChart },
  data() {
    return {
      isExpanded: false,
      showRawData: false,
    }
  },
  computed: {
    nutriScoreClass() {
      if (Object.keys(this.product.nutriscore).length > 0) {
        switch (this.product.nutriscore.grade.toUpperCase()) {
          case 'A':
            return 'score score-a'
          case 'B':
            return 'score score-b'
          case 'C':
            return 'score score-c'
          case 'D':
            return 'score score-d'
          case 'E':
            return 'score score-e'
          default:
            return ''
        }
      }
      return ''
    },
  },
}
</script>

<style scoped>
/* General Styling */
.dashboard {
  width: 100%;
  margin: auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: justify;

  & > * {
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;
  }
}

@media screen and (min-width: 768px) {
  .dashboard,
  .dashboard-header {
    max-width: 600px;
  }
}

.dashboard-header {
  position: fixed;
  width: 100%;
  background: var(--color-background);
  color: var(--color-text);
  margin: -20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1rem;

  margin-bottom: 1rem;
}

h2,
h3 {
  text-align: center;
}

/* Product Image */
.product-image {
  width: 100%;
  margin: auto;
  border-radius: 10px;
  aspect-ratio: 4/3;
  object-fit: contain;
  margin-top: 5rem;
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

/* Nutri-Score Colors */
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

/* Nutri-Score Table */
.nutriscore-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  overflow: hidden;
  background: white;
  color: black;
}

.nutriscore-table th,
.nutriscore-table td {
  padding: 10px;
  /* text-align: center; */
  border-bottom: 1px solid #ddd;
}

.negative-row {
  background: rgba(255, 77, 77, 0.1);
}
.positive-row {
  background: rgba(77, 255, 77, 0.1);
}
.negative {
  color: red;
  font-weight: bold;
}
.positive {
  color: green;
  font-weight: bold;
}

/* Final Score */
.final-score {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  border-top: 1px solid #ddd;
  padding-top: 15px;
}

/* Learn More Section */
.component-title {
  font-size: 1.1rem;
  cursor: pointer;
  color: #007bff;
  transition: color 0.2s;
}
.component-title:hover {
  color: #0056b3;
}

/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard {
    padding: 15px;
  }
  .nutriscore-table th,
  .nutriscore-table td {
    padding: 8px;
  }
}

.explanation {
  & pre {
    margin-top: 2rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: left;
    font-size: 0.9rem;
    background-color: #232323;
    color: white;
    padding: 2rem;
    border-radius: 5px;
  }
}

/* Responsive Table */
.nutriscore-table-container {
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
}

.nutriscore-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 400px; /* Ensures horizontal scrolling on smaller screens */
}

.nutriscore-table th,
.nutriscore-table td {
  white-space: nowrap; /* Prevents text wrapping */
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  padding: 10px;
}

.score-item {
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-radius: 8px;
}

.score-grid > div:nth-child(1) {
  order: 3;
}
.score-grid > div:nth-child(2) {
  order: 1;
}
.score-grid > div:nth-child(3) {
  order: 5;
}
.score-grid > div:nth-child(4) {
  order: 2;
}
.score-grid > div:nth-child(5) {
  order: 4;
}
.score-grid > div:nth-child(6) {
  order: 6;
}
.score-grid > div:nth-child(7) {
  order: 7;
}

.close-button {
  font-size: 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  width: 50px;
  color: var(--color-text);
  z-index: 1001;
}

.close-button:hover {
  color: red;
}

.spacer {
  width: 50px;
}
</style>
