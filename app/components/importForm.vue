<script setup lang="ts">
const upload = () => {
  $fetch("/api/upload", {
    method: 'POST',
    body: {

    }
  })
}
</script>

<template>
  <form>
    <input type="file"
           accept=".jpeg, .jpg, .png, .webp, .avif"
           @click="upload">
  </form>
</template>

<style scoped>

</style>