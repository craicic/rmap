<script setup lang="ts">
import type {TableColumn, TableRow} from '@nuxt/ui';
import type {TileMapData} from '#shared/info';
import {navigateTo} from '#app';

const route = useRoute()
const data = await $fetch<{ savedMaps: TileMapData[] }>('/api/maps/metadata');

const tableData = computed(() => data.savedMaps.slice() || []);
const columns: TableColumn<TileMapData>[] = [
    {
        header: 'Miniature',
        accessorKey: 'miniature'
    },
    {
        header: 'Nom',
        accessorKey: 'originalFile.name',
    },
    {
        header: 'Format',
        accessorKey: 'originalFile.format',
    },
    {
        header: 'Dimensions d\'entrée (px)',
        accessorFn: (row) => row.originalFile.width + ' * ' + row.originalFile.height
    },
    {
        header: 'Dimensions de sortie (px)',
        accessorFn: (row) => row.outTileMap?.maxZoomWidth + ' * ' + row.outTileMap?.maxZoomHeight
    },
    {
        header: 'Niveau de zoom',
        accessorKey: 'outTileMap.actualMaxZoom'
    }
];

function onSelect(e: Event, row: TableRow<TileMapData>): void {
    navigateTo('/maps/' + row.id)
}

function getImage(row: TableRow<TileMapData>) {
    return `/maps/${row.original.outTileMap?.location}/0/0/0.${row.original.originalFile.format}`;
}
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

        <UTable
            v-else
            :data="tableData"
            :columns="columns"
            @select="onSelect"
            class="flex-1">
            <template #miniature-cell="{row}">
                <div class="flex items-center gap-3">
                    <UAvatar
                        :src="getImage(row)"
                    />
                </div>
            </template>
        </UTable>
    </UContainer>
</template>

<style scoped></style>
