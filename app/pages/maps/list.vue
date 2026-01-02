<script setup lang="ts">
import type {TileMapData} from '#shared/info';


const data = await $fetch('/api/maps/metadata', {
  method: 'GET',
});

if (typeof data !== "string") {
    throw createError({ statusCode: 500, statusMessage: "Error in metadata, string expected"})
}
const maps: TileMapData[] = JSON.parse(data).maps;
</script>

<template>
  <div>
    <h1>Liste des maps</h1>
    <ol>
      <li v-for="(map, i) in maps" :key="i">
        <NuxtLink :to="'/maps/' + i">{{ map.originalFile.name }}</NuxtLink>
      </li>
    </ol>
  </div>
</template>

<style scoped></style>
