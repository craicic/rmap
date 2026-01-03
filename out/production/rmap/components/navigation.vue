<script setup lang="ts">
const {clear: clearSession} = useUserSession();

async function logout() {
    await clearSession();
    await navigateTo('/login');
}
const {user} = useUserSession();
</script>

<template>
    <UHeader title="RMAP" to="/">
        <p v-if="user">Bienvenue {{ user.name }}</p>

        <ul class="inline-flex gap-4 list-none p-0 m-0">
            <li>
                <UButton to="/import">Importer une carte</UButton>
            </li>
            <li>
                <UButton to="/maps/list">Liste des cartes</UButton>
            </li>
            <li>
                <UButton id="logout" @click="logout">Se déconnecter</UButton>
            </li>
        </ul>
    </UHeader>

    <slot />
</template>
