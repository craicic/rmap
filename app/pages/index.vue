<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated'],
})
const {user} = useUserSession()

</script>

<template>
  <div>
    <logoutHeader/>
    <h1 v-if="user">Welcome {{ user.name }}</h1>
    <div>
      <NuxtLink to="/map">Map</NuxtLink>
    </div>
    <hr>
  </div>
</template>