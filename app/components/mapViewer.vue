<script setup>
import 'leaflet/dist/leaflet.css';
import {onMounted, ref} from 'vue'

const tileSize = 256
const maxZoom = ref(4)

const imageSize = tileSize * Math.pow(2, maxZoom.value) // e.g., z=2 => 4*256 = 1024

// For CRS.Simple, southWest = [imageHeight, 0], northEast = [0, imageWidth]
// const simpleBoundsArray = [[imageSize, 0], [0, imageSize]]

const zoom = ref(0)
const mapId = ref('map')
let mapInstance;

const zoomReset = () => {
  if (mapInstance) {
    mapInstance.setView([0, 0], zoom.value, {animate: false})
  }
}

onMounted(async () => {
  // 1) Load Leaflet (ESM namespace)
  const L = await import('leaflet')

  // 2) Load RasterCoords from the package entry and normalize interop
  const RCModule = await import('leaflet-rastercoords')
  // Some bundlers wrap CJS as { default: fn }, and occasionally double-wrap as { default: { default: fn } }
  let RasterCoords = RCModule?.default ?? RCModule
  if (RasterCoords?.default) RasterCoords = RasterCoords.default

  // 3) Ensure we actually have the export
  if (typeof RasterCoords !== 'function') {
    throw new Error('leaflet-rastercoords module did not export a function/constructor')
  }

  // 4) Attach to the same L we use
  L.RasterCoords = RasterCoords

  // 5) Init map
  mapInstance = L.map(mapId.value, {
    crs: L.CRS.Simple,
    center: [0, 0],
    maxBoundsViscosity: 1.0,
    worldCopyJump: false,
  })

  // 6) Support both constructor and factory shapes
  const isClassLike = RasterCoords.prototype && (RasterCoords.prototype.unproject || RasterCoords.prototype.getMaxBounds)
  const rc = isClassLike
      ? new L.RasterCoords(mapInstance, [imageSize, imageSize])
      : L.RasterCoords(mapInstance, [imageSize, imageSize])

  // 7) Use rc
  mapInstance.setMaxZoom(maxZoom.value)
  mapInstance.setView(rc.unproject([imageSize, imageSize]), 2)

  L.tileLayer(`/map/{z}/{x}/{y}.png`, {
    noWrap: true,
    maxNativeZoom: (typeof rc.zoomLevel === 'function' ? rc.zoomLevel() : rc.zoomLevel ?? maxZoom.value),
    bounds: rc.getMaxBounds(),
  }).addTo(mapInstance)
})

</script>

<template>
  <div :id="mapId" style="height: 90vh"></div>
  <input type="button" value="Reset" @click="zoomReset">
</template>
