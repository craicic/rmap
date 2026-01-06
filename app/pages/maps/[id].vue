<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import {onMounted, ref} from 'vue';
import type {TileMapData} from '#shared/info';

const route = useRoute();
const id = String(route.params.id);

// Fetch one map by id
const map = await $fetch(`/api/maps/${encodeURIComponent(id)}/metadata`).catch((e) => {
    console.error('Fetch metadata failed', e);
    return null;
});

if (!map) {
    throw createError({statusCode: 404, statusMessage: 'Map not found'});
}

const data: TileMapData = map;
const format: string = data.config.format;
if (!data.outTileMap) throw new Error('Error in map data, outTileMap is undefined');
const outTileMap = data.outTileMap;
const location: string = outTileMap.location;
const maxZoom = ref<number>(outTileMap.actualMaxZoom);

const mapId = ref('map-' + String(route.params.id));
let mapInstance: any;

onMounted(async () => {
    // Dynamically import Leaflet and plugins only on client-side
    const L = await import('leaflet');
    const RasterCoords = (await import('leaflet-rastercoords')).default;

    // Use the scaled dimensions from tile generation, not original dimensions
    const width = Number(outTileMap.maxZoomWidth);
    const height = Number(outTileMap.maxZoomHeight);

    mapInstance = L.map(mapId.value, {
        crs: L.CRS.Simple,
        center: [0, 0],
        maxBoundsViscosity: 1.0,
        worldCopyJump: false,
    });

    const rc = new RasterCoords(mapInstance, [width, height]);

    mapInstance.setMaxZoom(maxZoom.value);
    console.log(maxZoom.value);
    mapInstance.setView(rc.unproject([0, 0]), 0);
    L.tileLayer(`/maps/${location}/{z}/{x}/{y}.${format}`, {
        noWrap: true,
        maxNativeZoom:
            typeof rc.zoomLevel === 'function' ? rc.zoomLevel() : (rc.zoomLevel ?? maxZoom.value),
        bounds: rc.getMaxBounds(),
    }).addTo(mapInstance);
});
</script>

<template>
    <ClientOnly>
        <div :id="mapId" style="height: 90vh;" class="w-full"></div>
    </ClientOnly>
</template>
