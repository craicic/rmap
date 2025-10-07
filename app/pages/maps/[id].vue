<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import { onMounted, ref } from 'vue';
import * as L from 'leaflet';
import RasterCoords from 'leaflet-rastercoords';
import LogoutHeader from '../../components/logoutHeader.vue';
import {TileMapData} from '../../../shared/info';

const route = useRoute();
const id = String(route.params.id);

// Fetch one map by id
const map = await $fetch(`/api/maps/${encodeURIComponent(id)}/metadata`).catch((e) => {
	console.error('Fetch metadata failed', e);
	return null;
});

if (!map) {
	throw createError({ statusCode: 404, statusMessage: 'Map not found' });
}

const data: TileMapData = map;
const location: string = data.outTileMap.location;
const format: string = data.config.format;
const maxZoom = ref<number>(data.outTileMap.actualMaxZoom);
const mapId = ref('map-' + String(route.params.id));
let mapInstance: L.Map;

onMounted(() => {
  // Use the scaled dimensions from tile generation, not original dimensions
  const width = Number(data.outTileMap.maxZoomWidth);
  const height = Number(data.outTileMap.maxZoomHeight);

  mapInstance = L.map(mapId.value, {
    crs: L.CRS.Simple,
    center: [0, 0],
    maxBoundsViscosity: 1.0,
    worldCopyJump: false,
  });

  const rc = new RasterCoords(mapInstance, [width, height]);

	mapInstance.setMaxZoom(maxZoom.value);
  console.log(maxZoom.value)
	mapInstance.setView(rc.unproject([0,0]), 0);
  console.log(`/maps/${location}/{z}/{x}/{y}.${format}`)
	L.tileLayer(`/maps/${location}/{z}/{x}/{y}.${format}`, {
		noWrap: true,
		maxNativeZoom:
			typeof rc.zoomLevel === 'function' ? rc.zoomLevel() : (rc.zoomLevel ?? maxZoom.value),
		bounds: rc.getMaxBounds(),
	}).addTo(mapInstance);
});
</script>

<template>
	<logoutHeader />
	<div :id="mapId" style="height: 90vh"></div>
</template>
