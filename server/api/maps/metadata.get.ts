import fs from 'fs';

export default defineEventHandler(async () => {
    const config = useRuntimeConfig();
    const filePath = config.public.mapsDir + 'metadata.json';

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (e) {
        throw createError({ statusCode: 500, statusMessage: 'Metadata not found' });
    }
});
