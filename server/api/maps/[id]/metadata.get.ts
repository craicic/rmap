import fs from 'fs';
import type { TileMapData } from '#shared/info';

export default defineEventHandler((event) => {
    const idParam = getRouterParam(event, 'id');
    if (!idParam) {
        throw createError({ statusCode: 400, statusMessage: 'Missing id' });
    }
    const id = Number.parseInt(idParam, 10);
    if (!Number.isFinite(id) || id < 0) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid id' });
    }

    const config = useRuntimeConfig();
    const metadata = JSON.parse(fs.readFileSync(config.public.mapsDir + 'metadata.json', 'utf8'));
    const entry: TileMapData = metadata.maps?.[id];
    if (!entry) {
        throw createError({ statusCode: 404, statusMessage: 'Map not found' });
    }
    return entry; // return plain object; Nitro will JSON it
});
