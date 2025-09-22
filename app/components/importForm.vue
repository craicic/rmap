<script setup lang="ts">
import {ref} from 'vue';

const files = ref<FileList | null>(null);
const url = ref("");

const upload = async () => {
  if (!files.value || files.value.length === 0) return;

  const form = new FormData();
  // If your API expects one file:
  form.append('file', files.value[0] as Blob);
  // If multiple are supported, you can loop:
  // Array.from(files.value).forEach(f => form.append('files', f));

  try {
    await $fetch('/api/upload', {
      method: 'POST',
      body: form,
    });
  } catch (e) {
    console.error('Upload failed', e);
  }
};

const previewFiles = (event: Event) => {
  if (!import.meta.client) return;

  files.value = (event.target as HTMLInputElement).files
  if (files.value && files.value[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      url.value = reader.result as string;
    };
    reader.readAsDataURL(files.value[0]);
  } else {
    url.value = "";
  }
}
</script>

<template>
  <form @submit.prevent="upload">
    <input
        id="file" type="file"
        accept="image/jpeg, image/png, image/webp, image/avif"
        @change="previewFiles">
    <button id="upload" type="submit">Upload</button>
  </form>
  <img v-if="files" alt="Selected image" :src="url">
</template>
<style scoped>
img {
  height: 50vh;
}
* {
  margin-top: 0.5rem;
}
</style>