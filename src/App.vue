<template>
  <div class="home">
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

<style>
/* make mobile */
.home {
  max-width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
