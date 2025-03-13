<template>
  <div class="dashboard">
    <h2>{{ product.name }}</h2>
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
    <div class="nutriscore">
      <h3 class="nutriscore-title">
        Nutri-Score:
        <span :class="nutriScoreClass">{{ product.nutriscore.grade.toUpperCase() }}</span>
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

    <p class="final-score"><strong>Endgültige Punktzahl:</strong> {{ product.nutriscore.score }}</p>
    <!-- Mehr erfahren -->
    <div class="learn-more">
      <h3 class="component-title" @click="isExpanded = !isExpanded">
        Wie wird der Nutri-Score berechnet?
      </h3>
      <transition name="fade">
        <div v-if="isExpanded" class="explanation">
          <p>
            Die Punktzahl wird anhand negativer und positiver Faktoren berechnet:
            <br />
            <strong>Negativ:</strong> Zucker, gesättigte Fettsäuren, Salz, Kalorien (höher ist
            schlechter).
            <br />
            <strong>Positiv:</strong> Ballaststoffe, Proteine, Obst & Gemüse (höher ist besser).
            <br />
            Eine endgültige Punktzahl wird berechnet, und der Buchstabe (A-E) wird entsprechend
            zugewiesen.
          </p>
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
    },
  },
}
</script>

<style scoped>
/* General Styling */
.dashboard {
  background: #f9f9f9;
  color: #333;
  width: 100%;
  max-width: 600px;
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

h2,
h3 {
  text-align: center;
}

/* Product Image */
.product-image {
  width: 100%;
  margin: auto;
  border-radius: 10px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
  aspect-ratio: 4/3;
  object-fit: contain;
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
  border-radius: 8px;
  overflow: hidden;
  background: white;
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

/* Mobile Optimization */
@media (max-width: 768px) {
  .nutriscore-table-container {
    border-radius: 8px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }
}
</style>
