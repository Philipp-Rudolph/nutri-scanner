<template>
  <div class="dashboard">
    <h2>{{ product.name }}</h2>
    <img :src="product.image" :alt="product.name" class="product-image" />

    <div class="info">
      <h3>Ingredients</h3>
      <p>{{ product.ingredients }}</p>
    </div>

    <div class="nutriscore">
      <h3>Nutri-Score: {{ product.nutriscore.grade.toUpperCase() }}</h3>
      <h4>Negative Components</h4>
      <ul>
        <li v-for="neg in product.nutriscore.components.negative" :key="neg.id">
          {{ neg.id }}: {{ neg.value }}{{ neg.unit }} ({{ neg.points }}/{{ neg.points_max }} points)
        </li>
      </ul>

      <h4>Positive Components</h4>
      <ul>
        <li v-for="pos in product.nutriscore.components.positive" :key="pos.id">
          {{ pos.id }}: {{ pos.value !== null ? pos.value : 'N/A' }}{{ pos.unit }} ({{
            pos.points
          }}/{{ pos.points_max }} points)
        </li>
      </ul>

      <p><strong>Final Score:</strong> {{ product.nutriscore.score }}</p>
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
}
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: #fff;
}
.product-image {
  width: 100%;
  max-width: 300px;
  display: block;
  margin: auto;
  border-radius: 5px;
}
.info,
.nutriscore {
  margin-top: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 5px 0;
}
</style>
