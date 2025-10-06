<script setup lang="ts">
import { ref, nextTick } from 'vue';

const url = ref('');
const loaded = ref(false);

let inputEl: HTMLInputElement | null = null;
const imgEl = ref<HTMLImageElement | null>(null);

const load = (e: Event) => {
	if (!import.meta.client) return;
	if (!e.target) return;
	inputEl = e.target as HTMLInputElement;
	const file = inputEl.files?.[0];
	if (!file) {
		url.value = '';
		return;
	}
	const reader = new FileReader();
	reader.onload = () => {
		url.value = reader.result as string; // data URL for preview
		switchState();
	};
	reader.readAsDataURL(file);
};

const upload = async (name: string, min: string, max: string, outputFormat: string) => {
	if (!inputEl?.files?.[0]) return;

	// ensure <img> rendered and loaded to read natural sizes
	await nextTick();
	// if the image hasn't loaded yet, wait for it
	if (imgEl.value && !imgEl.value.complete) {
		await new Promise<void>((resolve) => {
			imgEl.value!.addEventListener('load', () => resolve(), { once: true });
			imgEl.value!.addEventListener('error', () => resolve(), { once: true });
		});
	}
	const width = imgEl.value?.naturalWidth?.toString() ?? '';
	const height = imgEl.value?.naturalHeight?.toString() ?? '';

	const form = new FormData();
	form.append('file', inputEl.files[0]);
	form.append('name', name);
	form.append('minZoom', min);
	form.append('maxZoom', max);
	form.append('format', outputFormat);
	form.append('width', width);
	form.append('height', height);

	try {
		await $fetch('/api/upload', {
			method: 'POST',
			body: form,
		});
	} catch (e) {
		console.error('Upload failed', e);
	}
};

const switchState = () => {
	loaded.value = !loaded.value;
};
const remove = () => {
	inputEl = null;
	url.value = '';
	loaded.value = false;
};
</script>

<template>
	<input
		v-if="!loaded"
		id="file"
		type="file"
		accept="image/jpeg, image/png, image/webp"
		@change="load"
	/>
	<button v-if="loaded" id="remove" type="submit" @click.prevent="remove">Retirer l'image</button>
	<hr />
	<importDetails v-if="loaded" @is-set="upload" />

	<div v-if="loaded">
		<img ref="imgEl" alt="Selected image" :src="url" />
	</div>
</template>

<style scoped>
img {
	height: 50vh;
}

* {
	margin-top: 0.5rem;
}
</style>
