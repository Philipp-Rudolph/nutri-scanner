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
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: var(--color-background);
}
</style>
