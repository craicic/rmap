<script setup>
import 'leaflet/dist/leaflet.css';
import {onMounted, ref} from 'vue'

const route = useRoute()
console.log(route)
const maps = JSON.parse(localStorage.getItem('maps'));

const map = maps[route.params.id]

const location = map.location;
const format = map.format;
const maxZoom = ref(map.maxZoom);

const mapId = ref('map-' + route.params.id.toString())
console.log(mapId.value)
let mapInstance;

onMounted(async () => {
  const width = map.width;
  const height = map.height;
      // tileSize * Math.pow(2, maxZoom.value)
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
      ? new L.RasterCoords(mapInstance, [width, height])
      : L.RasterCoords(mapInstance, [width, height])

  // 7) Use rc
  mapInstance.setMaxZoom(maxZoom.value)
  mapInstance.setView(rc.unproject([width /2 , height / 2]), 0)
  L.tileLayer(`/maps/${location}/{z}/{x}/{y}.${format}`, {
    noWrap: true,
    maxNativeZoom: (typeof rc.zoomLevel === 'function' ? rc.zoomLevel() : rc.zoomLevel ?? maxZoom.value),
    bounds: rc.getMaxBounds(),
  }).addTo(mapInstance)
})
</script>

<template>
  <div :id="mapId" style="height: 90vh"></div>
</template>
