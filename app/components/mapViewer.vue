<script setup lang="ts">
import OpenSeadragon, {Viewer} from 'openseadragon';
import { ref, onMounted, onUnmounted } from 'vue';

let viewer: Viewer;

onMounted(() => {
  viewer = OpenSeadragon({
    id: 'open-seadragon',
    prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@2.4/build/openseadragon/images/',
    tileSources: {
     type: 'image',
      url: '/map.png'
    }
  });
});

onUnmounted(() => {
  if (viewer.isOpen()) {
    viewer.destroy();
  }
});
</script>

<template>
  <div id="open-seadragon" style="width: 800px; height: 600px;"></div>
  <p>Hello !</p>
</template>