<script setup>
import { ref } from 'vue'

const zoom = ref(6);
const center = ref([47.21322, -1.559482]);

const zoomReset = () => {
  zoom.value = 6;
  center.value = [47.21322, -1.559482];
}
</script>

<template>
  <LMap
      v-model:zoom="zoom"
      v-model:center="center"
      :use-global-leaflet="false"
      style="height: 350px"
  >
    <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
    />
  </LMap>
  <input type="button" value="reset" @click="zoomReset">
</template>