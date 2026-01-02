import fs from 'fs';

export default defineEventHandler(async () => {
    const config = useRuntimeConfig();
    const json: string = fs.readFileSync(config.public.mapsDir + 'metadata.json', 'utf8');
    if (!json)
        throw createError({ statusCode: 500, statusMessage: 'Metadata not found'});
    return json;
});
