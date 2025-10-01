<script setup lang="ts">
import {useRoute} from '#vue-router';

const {clear: clearSession} = useUserSession()
async function logout() {
  await clearSession()
  await navigateTo('/login')
}
</script>

<template>
  <div>
    <div v-if="!useRoute().matched.some(({path}) => path.startsWith('/map'))" class="link" >
      <NuxtLink to="/map">Go to map</NuxtLink>
    </div>
    <div v-else class="link">
      <NuxtLink to="/">Retourner à l'index</NuxtLink>
    </div>
    <button id="logout" @click="logout">Se déconnecter</button>
  </div>
  <hr>
</template>

<style scoped>
div {
  display: flex;
  align-items: center;
}

.link {
  flex: 20;
}

#logout {
  flex: 1;
}
</style>