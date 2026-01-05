<script setup lang="ts">
import type {TableColumn} from '@nuxt/ui';
import {ref} from 'vue';
import type {TileMapData} from '#shared/info';


const route = useRoute()
const metadata = await $fetch<{ savedMaps: TileMapData[] }>('/api/maps/metadata');

const tableData = computed(() => metadata?.savedMaps || []);


const columns: TableColumn<TileMapData>[] = [
    {
        accessorKey: 'originalFile.name',
        header: 'Name'
    },
    {
        accessorKey: 'originalFile.format',
        header: 'Format'
    }
];
</script>

<template>
    <UContainer class="flex flex-col items-center gap-4">
        <h1 class="text-4xl font-bold">Liste des cartes</h1>
        <template v-if="false">
            <UEmpty
                icon="i-lucide-file"
                title="Aucune carte trouvée"
                description="Il semble qu'aucune carte n'ait été ajoutée. Importez-en une pour commencer"
                :actions="[{
                        icon: 'i-lucide-plus',
                        label: 'Importer une carte',
                        to: '/import',
                        active: route.path.startsWith('/import')
             }]"/>
        </template>

        <template>
            <UTable :data="tableData" :columns="columns" class="flex-1"/>
        </template>
    </UContainer>

</template>

<style scoped></style>
