<template>
  <div>
    <h1>Vue Barcode Scanner</h1>
    <BarcodeScanner />
  </div>
</template>

<script lang="ts">
import BarcodeScanner from './components/BarcodeScanner.vue'
export default {
  components: { BarcodeScanner },
}
</script>
