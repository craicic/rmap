<script setup lang="ts">
import type { mapInfo } from '#shared/info';

let data: string = '';
try {
	data = await $fetch('/api/metadata', {
		method: 'GET',
	});
} catch (e) {
	console.error('Upload failed', e);
}

const maps: mapInfo[] = JSON.parse(data).maps;
localStorage.setItem('maps', JSON.stringify(maps));
</script>

<template>
	<ul>
		<li v-for="(map, i) in maps" :key="i">
			<NuxtLink :to="'/maps/' + i">{{ map.name }}</NuxtLink>
		</li>
	</ul>
</template>

<style scoped></style>
