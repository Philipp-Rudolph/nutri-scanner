<template>
  <div class="dashboard">
    <h2>{{ product.name }}</h2>
    <img :src="product.image" :alt="product.name" class="product-image" />

    <div class="info">
      <h3 class="section-title">Ingredients</h3>
      <p class="ingredient-text">{{ product.ingredients }}</p>
    </div>

    <div class="nutriscore">
      <h3 class="nutriscore-title">
        Nutri-Score:
        <span :class="nutriScoreClass">{{ product.nutriscore.grade.toUpperCase() }}</span>
      </h3>

      <h4 class="component-title">Negative Components</h4>
      <ul class="component-list negative">
        <li v-for="neg in product.nutriscore.components.negative" :key="neg.id">
          <span>{{ neg.id }}:</span> {{ neg.value }}{{ neg.unit }} ({{ neg.points }}/{{
            neg.points_max
          }}
          points)
        </li>
      </ul>

      <h4 class="component-title">Positive Components</h4>
      <ul class="component-list positive">
        <li v-for="pos in product.nutriscore.components.positive" :key="pos.id">
          <span>{{ pos.id }}:</span> {{ pos.value !== null ? pos.value : 'N/A' }}{{ pos.unit }} ({{
            pos.points
          }}/{{ pos.points_max }} points)
        </li>
      </ul>

      <p class="final-score"><strong>Final Score:</strong> {{ product.nutriscore.score }}</p>
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
  },
  computed: {
    nutriScoreClass() {
      switch (this.product.nutriscore.grade) {
        case 'A':
          return 'score-a'
        case 'B':
          return 'score-b'
        case 'C':
          return 'score-c'
        case 'D':
          return 'score-d'
        case 'E':
          return 'score-e'
        default:
          return ''
      }
    },
  },
}
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.product-image {
  width: 100%;
  max-width: 300px;
  display: block;
  margin: 20px auto;
  border-radius: 10px;
  border: 3px solid #ddd;
}

.info,
.nutriscore {
  margin-top: 30px;
}

.section-title {
  font-size: 1.5rem;
  color: #4caf50;
  margin-bottom: 10px;
}

.ingredient-text {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
}

.nutriscore-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.score-a {
  color: #4caf50; /* Green */
  font-weight: bold;
}

.score-b {
  color: #8bc34a; /* Light Green */
  font-weight: bold;
}

.score-c {
  color: #ffeb3b; /* Yellow */
  font-weight: bold;
}

.score-d {
  color: #ff9800; /* Orange */
  font-weight: bold;
}

.score-e {
  color: #f44336; /* Red */
  font-weight: bold;
}

.component-title {
  font-size: 1.2rem;
  color: #1976d2; /* Blue */
  margin-top: 20px;
}

.component-list {
  padding-left: 20px;
}

.component-list li {
  font-size: 1rem;
  color: #444;
  line-height: 1.5;
  margin-bottom: 5px;
}

.component-list.negative li {
  color: #f44336; /* Red for negative components */
}

.component-list.positive li {
  color: #4caf50; /* Green for positive components */
}

.final-score {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
  color: #333;
}
</style>
