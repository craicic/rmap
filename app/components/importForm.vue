<script setup lang="ts">
import {ref} from 'vue';
const url = ref('');
const detailed = ref(false);
let fileInfo: { title: string, min: string, max: string, outputFormat: string }
const load = (event: Event) => {
  if (!import.meta.client) return;

  files.value = (event.target as HTMLInputElement).files
  if (files.value && files.value[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      url.value = reader.result as string;
    };
    reader.readAsDataURL(files.value[0]);
    switchState();
  } else {
    url.value = '';
  }
}

const files = ref<FileList | null>(null);
const loaded = ref(false);
const upload = async () => {
  if (!files.value || files.value.length === 0) return;
  const form = new FormData();
  form.append('file', files.value[0] as Blob);
  form.append('title', fileInfo.title)
  form.append('minZoom', fileInfo.min)
  form.append('maxZoom', fileInfo.max)
  form.append('format', fileInfo.outputFormat)

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
}
const remove = () => {
  files.value = null;
  switchState();
}

const setDetails = (title: string, min: string, max: string, outputFormat: string) => {
  detailed.value = true
  fileInfo = {title: title, min: min, max: max, outputFormat: outputFormat}
}
</script>

<template>
  <input
      v-if="!loaded"
      id="file" type="file"
      accept="image/jpeg, image/png, image/webp"
      @change="load">
  <button v-if="loaded" id="remove" type="submit" @click.prevent="remove">Remove</button>
  <button v-if="detailed" id="upload" type="submit" @click.prevent="upload">Upload</button>
  <hr>
  <importDetails v-if="loaded" @is-set="setDetails"/>

  <div v-if="loaded">
    <img alt="Selected image" :src="url">
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