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
  height: -moz-available; /* WebKit-based browsers will ignore this. */
  height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
  height: fill-available;
  width: 100%;
  background: var(--color-background);
}
</style>
