<template>
  <div>
    <h2>Scan a Barcode</h2>
    <div id="scanner-container"></div>
    <p v-if="scannedCode">Scanned Code: {{ scannedCode }}</p>

    <div class="buttons">
      <button @click="startScanner">Start Scanner</button>
      <button @click="stopScanner">Stop Scanner</button>
    </div>

    <!-- Modal for displaying scanned product data -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Product Information</h3>
        <pre>{{ formattedProductData }}</pre>
        <button @click="showModal = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Quagga from '@ericblade/quagga2' // Ensure you're using the maintained fork

export default {
  data() {
    return {
      scannedCode: null as string | null,
      productData: null as Record<string, unknown> | null, // Store full product response
      showModal: false, // Controls modal visibility
    }
  },
  computed: {
    formattedProductData() {
      // make an array of data to return in the modal
      // containing data.ingredients_text, data.nutriscore_data, data.product_name, data.image_url
      const returnData = {
        name: this.productData?.product_name,
        ingredients: this.productData?.ingredients_text,
        nutriscore: this.productData?.nutriscore_data,
        image: this.productData?.image_url,
      }

      return this.productData ? JSON.stringify(returnData, null, 2) : 'No data available'
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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-height: 80%;
  overflow-y: auto;
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
}

.buttons {
  position: absolute;
  top: 50px;
  left: 70%;
}
</style>
