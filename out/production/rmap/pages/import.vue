<script setup lang="ts">
import {ref} from 'vue';
import type {FormError} from '@nuxt/ui';
import {navigateTo} from 'nuxt/app';

const errorContainer = ref<HTMLElement>();

const loading = ref(false);

const file = ref();
const name = ref();
const format = ref();

const state = reactive({
    file: new Blob(),
    name: '',
    format: 'webp',
    zoom: 4,
});

const zoom = ref(4);

const formats = ref(['webp', 'png', 'avif']);

const getImageDimensions = (f: File) => {
    return new Promise<{width: number; height: number}>((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        };
        img.src = URL.createObjectURL(state.file);
    });
};

const submit = async (event: any) => {
    loading.value = true;
    const {width, height} = await getImageDimensions(file.value);
    const form = new FormData();
    form.append('file', state.file);
    form.append('name', state.name);
    form.append('minZoom', '0');
    form.append('maxZoom', state.zoom.toString());
    form.append('format', state.format);
    form.append('width', width.toString());
    form.append('height', height.toString());
    try {
        const id = await $fetch('/api/upload', {
            method: 'POST',
            body: form,
        });
        console.log('ok');
        navigateTo('/maps/' + id);
    } catch (e) {
        errorContainer.value!.innerText = `Échec de l\'importation ${e}`;
        console.log('error');
    }
    loading.value = false;
};

const validate = (state: any): FormError[] => {
    const errors = [];
    if (!state.file) errors.push({name: 'file', message: 'Image requise'});
    return errors;
};
</script>

<template>
    <UMain class="grid place-items-center">
        <UContainer class="flex flex-col items-center gap-4">
            <h1 class="text-2xl font-bold">Importer une carte</h1>
            <UForm @submit="submit" :state="state" :validate="validate">
                <UFormField name="file" class="mb-4">
                    <UFileUpload
                        v-model="state.file"
                        class="w-full min-h-75"
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
                    <USelect
                        required
                        v-model="state.format"
                        :items="formats"
                        placeholder="format"
                    />
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
                    <p ref="errorContainer" class="text-red-600"></p>
                </div>
            </UForm>
        </UContainer>
    </UMain>
</template>
