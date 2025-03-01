<template>
  <div>
    <h2>Scan a Barcode</h2>
    <div id="scanner-container"></div>
    <p v-if="scannedCode">Scanned Code: {{ scannedCode }}</p>
    <div class="buttons">
      <button @click="startScanner">Start Scanner</button>
      <button @click="stopScanner">Stop Scanner</button>
    </div>
  </div>
</template>

<script lang="ts">
import Quagga from '@ericblade/quagga2' // Ensure you're using the maintained fork

export default {
  data() {
    return {
      scannedCode: null as string | null,
    }
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
            target: document.querySelector('#scanner-container') || undefined, // Container for the camera feed
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
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v2/product/${this.scannedCode}.json`,
        )
        const data = await response.json()
        console.log('Product Info:', data)
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
#scanner-container {
  width: 100%;
  height: 300px;
  border: 2px solid black;
}

.buttons {
  position: absolute;
  top: 50px;
  left: 70%;
}
</style>
