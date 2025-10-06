<script setup lang="ts">
import type { mapInfo } from '#shared/info';
import LogoutHeader from '../../components/logoutHeader.vue';

let data: string = '';
try {
	data = await $fetch('/api/maps/metadata', {
		method: 'GET',
	});
} catch (e) {
	console.error('Fetch failed', e);
}

const maps: mapInfo[] = JSON.parse(data).maps;
</script>

<template>
	<logoutHeader />
	<div>
		<h1>Liste des maps</h1>
		<ol>
			<li v-for="(map, i) in maps" :key="i">
				<NuxtLink :to="'/maps/' + i">{{ map.name }}</NuxtLink>
			</li>
		</ol>
	</div>
</template>

<style scoped></style>
