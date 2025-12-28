<script setup lang="ts">
import type { TileMapData } from '#shared/info';

let data: string = '';
try {
    data = await $fetch('/api/maps/metadata', {
        method: 'GET',
    });
} catch (e) {
    console.error('Fetch failed', e);
}

const maps: TileMapData[] = JSON.parse(data).maps;
console.table(maps);
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
