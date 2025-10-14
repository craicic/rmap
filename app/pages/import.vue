<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { navigateTo, useRoute } from '../../.nuxt/imports';
import type { FormError, FormSubmitEvent } from '@nuxt/ui';

const errorContainer = ref<HTMLElement>();

const loading = ref(false);
const state = reactive({
	file: undefined,
	name: undefined,
	format: undefined,
	zoom: 4,
});

const imgEl = ref<HTMLImageElement | null>(null);
const format = ref<string | null>(null);
const name = ref<string | null>(null);
const formats = ref(['webp', 'png', 'avif']);

const getImageDimensions = (file) => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			resolve({
				width: img.naturalWidth,
				height: img.naturalHeight,
			});
		};
		img.src = URL.createObjectURL(file);
	});
};

const submit = async (...e) => {
	loading.value = true;
	const { width, height } = await getImageDimensions(state.file);
	const form = new FormData();
	form.append('file', state.file);
	form.append('name', state.name);
	form.append('minZoom', '0');
	form.append('maxZoom', state.zoom.toString());
	form.append('format', state.format);
	form.append('width', width.toString());
	form.append('height', height.toString());
	try {
		let response = await $fetch('/api/upload', {
			method: 'POST',
			body: form,
		});
		navigateTo('/maps/' + response.id);
	} catch (e) {
		errorContainer.value!.innerText = `Échec de l\'importation ${e?.message || e}`;
	}
	loading.value = false;
};

const validate = (state: any): FormError[] => {
	const errors = [];
	if (!state.file) errors.push({ name: 'file', message: 'Image requise' });
	return errors;
};
</script>

<template>
	<UMain class="grid place-items-center">
		<UContainer class="flex flex-col items-center gap-4">
			<h1 class="text-2xl font-bold">Importer une carte</h1>
			<UForm :state="state" @submit="submit" :validate="validate">
				<UFormField name="file" class="mb-4">
					<UFileUpload
						v-model="state.file"
						class="w-full min-h-[300px]"
						accept="image/jpeg, image/png, image/webp, image/avif"
						label="Déposer votre image ici ou cliquer pour sélectionner"
					/>
				</UFormField>
				<div class="">
					<UInput
						required
						v-model="state.name"
						type="text"
						pattern="[a-zA-Z0-9]+"
						placeholder="Nom"
						class="mr-4"
					/>
					<USelect required v-model="state.format" :items="formats" placeholder="format" />
					<UFormField :label="`Zoom ${state.zoom}`" class="mt-4">
						<USlider v-model="state.zoom" :min="0" :max="8" />
					</UFormField>
					<USeparator class="mt-6 mb-4" />

					<UButton
						:loading
						type="submit"
						size="xl"
						:disabled="!state.file || !state.name || !state.format"
					>
						<span class="uppercase">Submit</span>
					</UButton>
					<p :ref="errorContainer" class="text-red-600"></p>
				</div>
			</UForm>
		</UContainer>
	</UMain>
</template>
