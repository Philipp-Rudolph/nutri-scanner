<template>
  <div class="dashboard">
    <img :src="product.image" :alt="product.name" class="product-image" />
    <h2>{{ product.name }}</h2>

    <!-- Nutri-Score Explanation Section -->
    <div class="nutriscore-explanation explanation">
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
        <span class="score-a">A</span>
        <span class="score-b">B</span>
        <span class="score-c">C</span>
        <span class="score-d">D</span>
        <span class="score-e">E</span>
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
            <th class="t-a-l">Component</th>
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
            <td class="t-a-l">{{ neg.id }}</td>
            <td>{{ neg.value }}{{ neg.unit }}</td>
            <td class="negative">-{{ neg.points }} points</td>
          </tr>
          <tr
            v-for="pos in product.nutriscore.components.positive"
            :key="pos.id"
            class="positive-row"
          >
            <td class="t-a-l">{{ pos.id }}</td>
            <td>{{ pos.value !== null ? pos.value : 'N/A' }}{{ pos.unit }}</td>
            <td class="positive">+{{ pos.points }} points</td>
          </tr>
        </tbody>
      </table>

      <p class="final-score"><strong>Final Score:</strong> {{ product.nutriscore.score }}</p>

      <!-- Learn More Section -->
      <div class="learn-more">
        <h3 class="component-title pointer" @click="isExpanded = !isExpanded">
          How is Nutri-Score Calculated?
        </h3>
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
          <pre><code><h2>Raw Data:</h2>{{ JSON.stringify(data, null, 2) }}</code></pre>
        </div>
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
      console.log(this.product.nutriscore.grade)
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
  background: var(--color-background);
  color: black;
  width: 100%;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

h2,
h3,
.final-score {
  margin: 0 auto;
  color: var(--color-text);
}

.product-image {
  width: 100%;
  max-width: 300px;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Nutri-Score Explanation */
.nutriscore-explanation {
  text-align: center;
  margin-bottom: 20px;
}

.nutriscore-explanation p {
  font-size: 1rem;
  color: #444;
}

/* Nutri-Score Scale */
.nutriscore-scale {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-weight: bold;
  margin-top: 10px;
}

.nutriscore-scale span {
  padding: 5px 15px;
  border-radius: 5px;
  font-size: 1.2rem;
}

.score {
  font-size: 1.2rem;
  padding: 5px 15px;
  border-radius: 5px;
}

.score-a {
  background: #008000;
  color: #fff;
} /* Green */
.score-b {
  background: #80c000;
  color: #fff;
} /* Light Green */
.score-c {
  background: #ffc000;
  color: #fff;
} /* Yellow */
.score-d {
  background: #ff8000;
  color: #fff;
} /* Orange */
.score-e {
  background: #e00000;
  color: #fff;
} /* Red */

/* Nutri-Score Breakdown */
.nutriscore-title {
  font-size: 1.5rem;
  text-align: center;
}

.nutriscore-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 8px;
}

.nutriscore-table th,
.nutriscore-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.negative-row {
  background-color: rgba(244, 67, 54, 0.1);
}
.positive-row {
  background-color: rgba(76, 175, 80, 0.1);
}

.negative {
  color: red;
  font-weight: bold;
}
.positive {
  color: green;
  font-weight: bold;
}

.final-score {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
}

/* Learn More Section */
.learn-more {
  margin-top: 20px;
  text-align: center;
}

.component-title {
  font-size: 1.2rem;
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
}

.explanation {
  background: #f4f4f4;
  padding: 2rem;
  border-radius: 5px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 25px;

  pre {
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

/* Table Styling */
.t-a-l {
  text-align: left !important;
}

/* Responsive Styling */
@media (max-width: 768px) {
  .dashboard {
    padding: 10px;
  }

  .product-image {
    max-width: 200px;
  }

  .nutriscore-explanation p {
    font-size: 0.9rem;
  }

  .nutriscore-scale span {
    padding: 5px 10px;
    font-size: 1rem;
  }

  .nutriscore-title {
    font-size: 1.2rem;
  }

  .nutriscore-table th,
  .nutriscore-table td {
    padding: 10px;
  }

  .final-score {
    font-size: 1rem;
  }

  .component-title {
    font-size: 1rem;
  }

  .explanation {
    padding: 1rem;
  }

  pre {
    font-size: 0.8rem;
  }
}
</style>
