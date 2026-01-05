<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui';

const {clear: clearSession} = useUserSession();

async function logout() {
    await clearSession();
    await navigateTo('/login');
}
const {user} = useUserSession();

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
    {
        label: 'Importer une carte',
        to: '/import',
        active: route.path.startsWith('/import')
    },
    {
        label: 'Liste des cartes',
        to: '/maps/list',
        active: route.path.startsWith('/maps/list')
    },
    {
        label: 'Dépot Github',
        to: 'https://github.com/craicic/rmap',
        target: '_blank'
    }
]);

</script>

<template>
    <UHeader title="RMAP" to="/">
        <UNavigationMenu :items="items" />
        <template #right>
            <UColorModeButton />
            <template v-if="user">
            <UButton
                icon="lucide:log-out"
                size="md"
                color="neutral"
                variant="outline">
                Logout
            </UButton>
            </template>
        </template>
    </UHeader>

</template>
