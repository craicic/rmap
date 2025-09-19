<script setup>
definePageMeta({
  middleware: ['authenticated'],
})
</script>

<template>
  <div>
    <logoutHeader />
    <import-form />
  </div>
</template>

<style scoped>

</style>