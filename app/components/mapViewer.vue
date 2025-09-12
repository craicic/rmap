<script setup>
import { latLngBounds, CRS } from 'leaflet';
import { ref } from 'vue'

const tileSize = 256;
const maxZoom = ref(4);
const imageSize = tileSize * Math.pow(2, maxZoom.value); // 4096 for 256 * 2^4
const bounds = ref(latLngBounds([0, 0], [imageSize, imageSize]));

const zoom = ref(1);
const center = ref(bounds.value.getCenter());

const zoomReset = () => {
  zoom.value = 0;
  center.value = bounds.value.getCenter();
  console.log(center.value)
  console.log(CRS.Simple)
}
</script>


<template>
    <LMap
        v-model:zoom="zoom"
        v-model:center="center"
        :bounds="bounds"
        :max-bounds="bounds"
        :max-bounds-viscosity="1.0"
        :min-zoom="0"
        :max-zoom="maxZoom"
        :crs="CRS.Simple"
        :world-copy-jump="false"
        :use-global-leaflet="false"
        style="height: 700px"
    >
      <LTileLayer

          url="/map/{z}/{x}/{y}.png"
          :no-wrap="true"
          :min-zoom="0"
          :max-zoom="maxZoom"
          name="treasure-map"
      />
    </LMap>


  <input type="button" value="reset" @click="zoomReset">
</template>