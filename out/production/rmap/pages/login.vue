<script setup lang="ts">
import {ref} from 'vue';

const {fetch: refreshSession} = useUserSession();
const credentials = reactive({
    email: '',
    password: '',
});
const error = ref('');
async function login() {
    await $fetch('/api/login', {
        method: 'POST',
        body: credentials,
    })
        .then(async () => {
            // Refresh the session client-side and redirect to the home page
            await refreshSession();
            await navigateTo('/');
        })
        .catch((e) => {
            error.value = e?.data?.message || 'Login failed';
        });
}
</script>

<template>
    <form @submit.prevent="login">
        <input v-model="credentials.email" type="email" placeholder="Email" />
        <input v-model="credentials.password" type="password" placeholder="Mot de passe" />
        <button type="submit">Se connecter</button>
        <div v-if="error">{{ error }}</div>
    </form>
</template>
