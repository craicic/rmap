<script setup lang="ts">
import {ref} from 'vue';

const url = ref('');

const load = (event: Event) => {
  if (!import.meta.client) return;

  files.value = (event.target as HTMLInputElement).files
  if (files.value && files.value[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      url.value = reader.result as string;
    };
    reader.readAsDataURL(files.value[0]);
    switchState()
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
</script>

<template>
  <input
      v-if="!loaded"
      id="file" type="file"
      accept="image/jpeg, image/png, image/webp, image/avif"
      @change="load">
  <button v-if="loaded" id="remove" type="submit" @click.prevent="remove">Remove</button>
  <button v-if="loaded" id="upload" type="submit" @click.prevent="upload">Upload</button>

  <div v-if="loaded">
    <img alt="Selected image" :src="url">
    <!--    <button id="details" type="submit" @submit.prevent="displayDetails">Display details</button>-->
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