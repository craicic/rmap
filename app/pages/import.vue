<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormError } from '@nuxt/ui';
import { navigateTo } from 'nuxt/app';

const errorContainer = ref<HTMLElement>();

const loading = ref(false);

const file = ref();
const name = ref();
const format = ref();
const zoom = ref(4);

const imgEl = ref<HTMLImageElement | null>(null);
const formats = ref(['webp', 'png', 'avif']);

const getImageDimensions = (f: File) => {
    return new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        };
        img.src = URL.createObjectURL(file.value);
    });
};

const submit = async (event: any) => {
    loading.value = true;
    const { width, height } = await getImageDimensions(file.value);
    const form = new FormData();
    form.append('file', file.value);
    form.append('name', name.value);
    form.append('minZoom', '0');
    form.append('maxZoom', zoom.value.toString());
    form.append('format', format.value);
    form.append('width', width.toString());
    form.append('height', height.toString());
    try {
        const response: { id: number } = await $fetch('/api/upload', {
            method: 'POST',
            body: form,
        });
        navigateTo('/maps/' + response.id);
    } catch (e) {
        errorContainer.value!.innerText = `Échec de l\'importation ${e}`;
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
            <UForm @submit="submit" :validate="validate">
                <UFormField name="file" class="mb-4">
                    <UFileUpload
                        v-model="file"
                        class="w-full min-h-[300px]"
                        accept="image/jpeg, image/png, image/webp, image/avif"
                        label="Déposer votre image ici ou cliquer pour sélectionner"
                    />
                </UFormField>
                <div class="">
                    <UInput
                        required
                        v-model="name"
                        type="text"
                        pattern="[a-zA-Z0-9]+"
                        placeholder="Nom"
                        class="mr-4"
                    />
                    <USelect required v-model="format" :items="formats" placeholder="format" />
                    <UFormField :label="`Zoom ${zoom}`" class="mt-4">
                        <USlider v-model="zoom" :min="0" :max="8" />
                    </UFormField>
                    <USeparator class="mt-6 mb-4" />

                    <UButton :loading type="submit" size="xl" :disabled="!file || !name || !format">
                        <span class="uppercase">Submit</span>
                    </UButton>
                    <p ref="errorContainer" class="text-red-600"></p>
                </div>
            </UForm>
        </UContainer>
    </UMain>
</template>
