<template>
  <div class="barcode-scanner">
    <h2>Scan a Barcode</h2>

    <div class="scanner-wrapper">
      <div id="scanner-container">
        <div class="crosshair"></div>
      </div>
    </div>

    <p v-if="scannedCode" class="scanned-code">
      Scanned Code: <strong>{{ scannedCode }}</strong>
    </p>

    <div class="button-group">
      <button @click="startScanner" class="primary-button">Start Scanner</button>
      <button @click="stopScanner" class="secondary-button">Stop Scanner</button>
    </div>

    <!-- Modal for scanned product data -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <button @click="showModal = false" class="close-button">×</button>
        <ProductDashboard :product="formattedProductData" :data="productData || {}" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ProductDashboard from './ProductDashboard.vue'
import Quagga from '@ericblade/quagga2'

export default {
  components: { ProductDashboard },
  data() {
    return {
      scannedCode: null as string | null,
      productData: null as Record<string, unknown> | null,
      showModal: false,
    }
  },
  computed: {
    formattedProductData() {
      return this.productData
        ? {
            name: this.productData.product_name ?? 'No name available',
            ingredients: this.productData.ingredients_text ?? 'No ingredients available',
            nutriscore: this.productData.nutriscore_data ?? {},
            image: this.productData.image_url ?? '',
          }
        : {
            name: 'No data available',
            ingredients: 'No data available',
            nutriscore: {},
            image: '',
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
            constraints: { facingMode: 'environment' },
            target: document.querySelector('#scanner-container') || undefined,
          },
          decoder: {
            readers: ['ean_reader', 'upc_reader', 'code_128_reader'],
          },
        },
        (err) => {
          if (err) {
            console.error('Error initializing Quagga:', err)
            return
          }
          console.log('Scanner initialized')
          Quagga.start()
          setTimeout(() => {
            document.querySelectorAll('canvas').forEach((canvas) => canvas.remove())
            document
              .querySelectorAll('.crosshair')
              .forEach((crosshair) => ((crosshair as HTMLElement).style.display = 'block'))
          }, 10)
        },
      )

      Quagga.onDetected(async (result) => {
        this.scannedCode = result.codeResult.code
        this.stopScanner()
        try {
          const response = await fetch(
            `https://world.openfoodfacts.org/api/v2/product/${this.scannedCode}.json`,
          )
          const data = await response.json()
          console.log('Product Info:', data)

          if (data.product) {
            this.productData = data.product
            this.showModal = true
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

<style scoped>
/* General Layout */
.barcode-scanner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: var(--color-background);
  text-align: center;
  width: 100%;
}

/* Scanner Container */
.scanner-wrapper {
  width: 100%;
  max-width: 400px;
  position: relative;
}

#scanner-container {
  width: 100%;
  height: 300px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
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
}

canvas {
  display: none !important;
  visibility: hidden !important;
  width: 0 !important;
  height: 0 !important;
  opacity: 0 !important;
}

/* Scanner Crosshair */
.crosshair {
  width: 60%;
  height: 40%;
  border: 2px dashed red;
  position: absolute;
  display: none;
}

/* Scanned Code */
.scanned-code {
  font-size: 1rem;
  color: #333;
}

/* Buttons */
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

button {
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-button {
  background: #007bff;
  color: white;
}

.primary-button:hover {
  background: #0056b3;
}

.secondary-button {
  background: #ff4d4d;
  color: white;
}

.secondary-button:hover {
  background: #cc0000;
}

/* Modal */
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
  background: white;
  padding: 20px;
  border-radius: 12px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
}

.close-button:hover {
  color: red;
}

/* Responsive */
@media (max-width: 600px) {
  .scanner-wrapper {
    max-width: 100%;
  }

  .button-group {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
}
</style>
