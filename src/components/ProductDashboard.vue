<template>
  <div class="dashboard">
    <img :src="product.image" :alt="product.name" class="product-image" />
    <h2>{{ product.name }}</h2>

    <!-- Nutri-Score Explanation Section -->
    <div class="nutriscore-explanation">
      <h3>What is the Nutri-Score?</h3>
      <p>
        The Nutri-Score is a food rating system that classifies products from
        <span class="score-a">A (Healthiest)</span> to
        <span class="score-e">E (Least Healthy)</span>. It is based on nutrients to limit (sugar,
        saturated fat, salt, calories) and nutrients to favor (fiber, protein, fruits, and
        vegetables).
      </p>

      <!-- Visual Nutri-Score Scale -->
      <div class="nutriscore-scale">
        <span class="score score-a">A</span>
        <span class="score score-b">B</span>
        <span class="score score-c">C</span>
        <span class="score score-d">D</span>
        <span class="score score-e">E</span>
      </div>
    </div>

    <!-- Nutri-Score Breakdown -->
    <div class="nutriscore">
      <h3 class="nutriscore-title">
        Nutri-Score:
        <span :class="nutriScoreClass">{{ product.nutriscore.grade.toUpperCase() }}</span>
      </h3>

      <table class="nutriscore-table">
        <thead>
          <tr>
            <th>Component</th>
            <th>Value</th>
            <th>Impact</th>
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
            <td class="negative">-{{ neg.points }} points</td>
          </tr>
          <tr
            v-for="pos in product.nutriscore.components.positive"
            :key="pos.id"
            class="positive-row"
          >
            <td>{{ pos.id }}</td>
            <td>{{ pos.value !== null ? pos.value : 'N/A' }}{{ pos.unit }}</td>
            <td class="positive">+{{ pos.points }} points</td>
          </tr>
        </tbody>
      </table>

      <p class="final-score"><strong>Final Score:</strong> {{ product.nutriscore.score }}</p>

      <!-- Learn More Section -->
      <div class="learn-more">
        <h3 class="component-title" @click="isExpanded = !isExpanded">
          How is Nutri-Score Calculated?
        </h3>
        <transition name="fade">
          <div v-if="isExpanded" class="explanation">
            <p>
              The score is calculated based on negative and positive factors:
              <br />
              <strong>Negative:</strong> Sugars, Saturated Fat, Salt, Calories (higher is worse).
              <br />
              <strong>Positive:</strong> Fiber, Protein, Fruits & Vegetables (higher is better).
              <br />
              A final score is computed, and the letter grade (A-E) is assigned accordingly.
            </p>
            <pre><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
  data() {
    return {
      isExpanded: false,
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
}

h2,
h3 {
  text-align: center;
}

/* Product Image */
.product-image {
  width: 100%;
  max-width: 250px;
  margin: auto;
  border-radius: 10px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
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
  text-align: center;
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
  & pre[data-v-ca160bc8] {
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
</style>
