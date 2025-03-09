<template>
  <div class="barcode-scanner">
    <h2>Scan a Barcode</h2>
    <div id="scanner-container">
      <!-- Camera feed will be displayed here -->
      <div class="scanner-container--crosshair"></div>
    </div>
    <p v-if="scannedCode">Scanned Code: {{ scannedCode }}</p>

    <div class="buttons">
      <button @click="startScanner">Start Scanner</button>
      <button @click="stopScanner">Stop Scanner</button>
    </div>

    <!-- Modal for displaying scanned product data -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <button @click="showModal = false" class="close-button">Close</button>
        <ProductDashboard :product="formattedProductData" :data="productData || {}" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ProductDashboard from './ProductDashboard.vue'
import Quagga from '@ericblade/quagga2' // Ensure you're using the maintained fork

export default {
  components: { ProductDashboard },
  data() {
    return {
      scannedCode: null as string | null,
      productData: null as Record<string, unknown> | null, // Store full product response
      showModal: false, // Controls modal visibility
    }
  },
  computed: {
    formattedProductData() {
      if (!this.productData) {
        return {
          name: 'No data available',
          ingredients: 'No data available',
          nutriscore: {},
          image: '',
        }
      }

      return {
        name: this.productData.product_name ?? 'No name available',
        ingredients: this.productData.ingredients_text ?? 'No ingredients available',
        nutriscore: this.productData.nutriscore_data ?? {},
        image: this.productData.image_url ?? '',
      }
    },
  },
  methods: {
    startScanner() {
      console.log('Starting scanner...')

      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              facingMode: 'environment', // Use the back camera
            },
            target: document.querySelector('#scanner-container') || undefined, // Camera feed container
          },
          decoder: {
            readers: ['ean_reader', 'upc_reader', 'code_128_reader'], // Supported barcode formats
          },
        },
        (err) => {
          if (err) {
            console.error('Error initializing Quagga:', err)
            return
          }
          console.log('Quagga initialized successfully!')
          Quagga.start()
        },
      )

      Quagga.onDetected(async (result) => {
        this.scannedCode = result.codeResult.code
        this.stopScanner()

        // Fetch product data
        try {
          const response = await fetch(
            `https://world.openfoodfacts.org/api/v2/product/${this.scannedCode}.json`,
          )
          const data = await response.json()
          console.log('Product Info:', data)

          if (data.product) {
            this.productData = data.product
            this.showModal = true // Show modal with product data
          } else {
            alert('Product not found')
          }
        } catch (error) {
          console.error('Error fetching product data:', error)
          alert('Failed to fetch product data')
        }
      })
    },

    stopScanner() {
      console.log('Stopping scanner...')
      Quagga.stop()
    },
  },
}
</script>

<style>
.barcode-scanner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;

  & h2 {
    color: var(--color-text);
  }
}
/* Basic modal styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  padding: 20px;
  border-radius: 8px;
  overflow-y: auto;
  background: #fff;
  max-width: 90%;
  max-height: 90%;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
}

#scanner-container {
  width: 100%;
  height: 80vh;
  border: 2px solid black;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  & video {
    width: 100%;
    height: 100%;
  }

  & canvas {
    display: none;
  }

  & .scanner-container--crosshair {
    position: absolute;
    width: 50%;
    height: 30%;
    border: 2px dashed red;
    z-index: 100;
  }
}

.buttons {
  position: absolute;
  top: 50px;
  left: 70%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  & button {
    margin: 0 10px;
    padding: 10px 20px;
    border: none;
    background-color: #333;
    color: #fff;
    cursor: pointer;
    border-radius: 5px;
  }
}

.close-button {
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
  border: 1px solid #333;
  background-color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s;

  &:hover {
    background-color: #333;
    color: #fff;
  }
}
</style>
