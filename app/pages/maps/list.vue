<script setup lang="ts">
import type {TableColumn} from '@nuxt/ui';
import type {TileMapData} from '#shared/info';

const route = useRoute()
const data = await $fetch<{ savedMaps: TileMapData[] }>('/api/maps/metadata');

const tableData = computed(() => data.savedMaps.slice() || []);
const columns: TableColumn<TileMapData>[] = [
    {
        header: 'Name',
        accessorKey: 'originalFile.name',
    },
    {
        header: 'Format',
        accessorKey: 'originalFile.format',
    }
];
</script>

<template>
    <UContainer class="flex flex-col items-center gap-4">
        <h1 class="text-4xl font-bold">Liste des cartes</h1>
        <UEmpty
            v-if="!tableData.length"
            icon="i-lucide-file"
            title="Aucune carte trouvée"
            description="Il semble qu'aucune carte n'ait été ajoutée. Importez-en une pour commencer"
            :actions="[{
                        icon: 'i-lucide-plus',
                        label: 'Importer une carte',
                        to: '/import',
                        active: route.path.startsWith('/import')
             }]"/>

        <UTable v-else :data="tableData" :columns="columns" class="flex-1"/>
    </UContainer>
</template>

<style scoped></style>
