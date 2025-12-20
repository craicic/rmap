import fs from 'fs';

export default defineEventHandler(async () => {
    const config = useRuntimeConfig();
    const json = fs.readFileSync(config.public.mapsDir + 'metadata.json', 'utf8');
    return json !== null ? json : 400;
});
