<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import { onMounted, ref } from 'vue';
import * as L from 'leaflet';
import RasterCoords from 'leaflet-rastercoords';

const route = useRoute();
const maps = JSON.parse(localStorage.getItem('maps') as string);
const map = maps[route.params.id as keyof typeof maps];

const location: string = map.location;
const format: string = map.format;
const maxZoom = ref<number>(Number(map.maxZoom));
const mapId = ref('map-' + String(route.params.id));
let mapInstance: L.Map;

onMounted(() => {
  const width = Number(map.width);
  const height = Number(map.height);

  mapInstance = L.map(mapId.value, {
    crs: L.CRS.Simple,
    center: [0, 0],
    maxBoundsViscosity: 1.0,
    worldCopyJump: false
  });

  const rc = new RasterCoords(mapInstance, [width, height]);

  mapInstance.setMaxZoom(maxZoom.value);
  mapInstance.setView(rc.unproject([width / 2, height / 2]), 0);
  L.tileLayer(`/maps/${location}/{z}/{x}/{y}.${format}`, {
    noWrap: true,
    maxNativeZoom:
      typeof rc.zoomLevel === 'function' ? rc.zoomLevel() : (rc.zoomLevel ?? maxZoom.value),
    bounds: rc.getMaxBounds()
  }).addTo(mapInstance);
})
</script>

<template>
  <div :id="mapId" style="height: 90vh"></div>
</template>
