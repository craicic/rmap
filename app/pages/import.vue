<script setup>

definePageMeta({
  middleware: ['authenticated'],
})
</script>

<template>
  <div>
    <logoutHeader />
    <importForm />
  </div>
</template>

<style scoped>
div {
  margin: 0.5rem;
}
</style>