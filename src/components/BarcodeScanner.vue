<template>
  <div class="barcode-scanner">
    <h1>Nutri Score Scanner</h1>
    <h2>Scanne einen Barcode</h2>

    <div class="scanner-wrapper">
      <div id="scanner-container">
        <div class="crosshair" ref="crosshair"></div>
      </div>
    </div>

    <div class="button-group">
      <button @click="startScanner" class="primary-button">Start Scanner</button>
      <button @click="stopScanner" class="secondary-button">Stop Scanner</button>
      <button @click="simulateScan" class="dev-button">Dev Mode: Simulate Scan</button>
    </div>

    <div v-if="showModal" class="modal" :class="{ show: showModal }">
      <ProductDashboard
        class="modal-content"
        :product="formattedProductData"
        :data="productData || {}"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<script lang="ts">
import ProductDashboard from './ProductDashboard.vue'
import Quagga from '@ericblade/quagga2'
import type { Product, NutriScore } from '@/types/product'

export default {
  components: { ProductDashboard },
  data() {
    return {
      scannedCode: null as string | null,
      productData: null as Record<string, unknown> | null,
      showModal: false,
      scanning: false,
    }
  },
  computed: {
    formattedProductData(): Product {
      if (!this.productData) {
        return {
          name: 'No data available',
          ingredients: ['No data available'],
          nutriscore: undefined,
          image: '',
        }
      }

      return {
        name:
          typeof this.productData.product_name === 'string'
            ? this.productData.product_name
            : 'No name available',
        ingredients:
          typeof this.productData.ingredients_text === 'string'
            ? [this.productData.ingredients_text]
            : ['No ingredients available'],
        nutriscore:
          this.productData.nutriscore_data &&
          typeof this.productData.nutriscore_data === 'object' &&
          'grade' in this.productData.nutriscore_data
            ? (this.productData.nutriscore_data as NutriScore)
            : undefined,
        image: typeof this.productData.image_url === 'string' ? this.productData.image_url : '',
      }
    },
  },
  methods: {
    startScanner() {
      if (this.scanning) return
      this.scanning = true
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
            const crosshair = this.$refs.crosshair as HTMLElement
            crosshair.style.display = 'block'
            document.querySelectorAll('canvas').forEach((canvas) => canvas.remove())
          }, 10)
        },
      )

      Quagga.onDetected(async (result) => {
        this.scannedCode = result.codeResult.code
        this.$router.push({ query: { code: this.scannedCode } })
        if (this.scannedCode) {
          this.fetchProductData(this.scannedCode)
        }
      })
    },
    stopScanner() {
      console.log('Stopping scanner...')
      Quagga.stop()
      this.scanning = false
      const crosshair = this.$refs.crosshair as HTMLElement
      crosshair.style.display = 'none'
    },
    async fetchProductData(code: string) {
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`)
        if (!response.ok) {
          console.warn('No valid response, adjusting camera angle...')
          return
        }
        const data = await response.json()
        console.log('Product Info:', data)

        if (data.product) {
          this.productData = data.product
          this.showModal = true
          this.stopScanner()
        } else {
          alert('Product not found')
        }
      } catch (error) {
        console.error('Error fetching product data:', error)
        alert('Failed to fetch product data')
      }
    },
    simulateScan() {
      console.log('Simulating scan...')
      this.scannedCode = '7394376616501'
      this.$router.push({ query: { code: this.scannedCode } })
      this.fetchProductData(this.scannedCode)
    },
    closeModal() {
      console.log('Closing modal...')
      this.showModal = false
      this.$router.push({ query: {} })
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
  justify-content: space-between;
  gap: 15px;
  padding: 20px;
  background: var(--color-background);
  text-align: center;
  width: 100%;
  height: 100%;
}

/* Scanner Wrapper */
.scanner-wrapper {
  width: 100%;
  max-width: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

/* Scanner Container */
#scanner-container {
  width: 100%;
  height: 50dvh;
  border-radius: 2rem;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease; /* Übergangseffekte für spätere Aktivierung */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

/* Crosshair */
#scanner-container .crosshair {
  position: absolute;
  width: 60%;
  height: 20%;
  border: 2px solid #00ffdd; /* Grauer Rand für das Crosshair */
  /* border-radius: 50%; */
  animation: pulse 1.5s infinite; /* Sanfte Pulsanimation */
  border-radius: 10px;
}

/* Animation für das Crosshair */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

/* Video und Canvas */
#scanner-container video {
  display: none; /* Video vor Aktivierung unsichtbar */
}

#scanner-container canvas {
  display: none; /* Canvas auch unsichtbar vor der Aktivierung */
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
  left: 0;
  bottom: -100%;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: bottom 0.3s ease-in-out;
}

.modal.show {
  bottom: 0; /* Slide up */
}

.modal-content {
  background: var(--color-background);
  overflow-y: auto;
  position: relative;
  width: 90%;
  height: 100%;
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
