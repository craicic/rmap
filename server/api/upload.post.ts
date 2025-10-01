import fs from 'fs';
import imageToTiles from '../services/tiles'
import path from 'path';
import os from 'os';

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event);

    if (!formData) {
        console.log('No form data received');
        throw createError({
            statusCode: 400,
            message: 'No form data received'
        });
    }

    const tempDirPath = fs.mkdtempSync(path.join(os.tmpdir(), 'rmap-'));
    let file = null;
    let filepath: string = '';
    const metadata: Record<string, string> = {};


    formData?.forEach((part) => {
        if (part.filename) {
            file = {
                filename: part.filename,
                data: part.data,
                type: part.type
            }
            if (!file || !file.type || !file.filename) return;
            // Normalize MIME to canonical extension
            const mime = file.type.toLowerCase();
            const mimeToExt: Record<string, string> = {
                'image/png': 'png',
                'image/jpeg': 'jpeg',
                'image/jpg': 'jpeg',
                'image/webp': 'webp',
            };
            const ext = mimeToExt[mime] ?? 'bin';

            filepath = path.join(tempDirPath, file.filename);
            fs.writeFileSync(filepath, file.data);
            const allowed = new Set(['png', 'jpeg', 'webp']);
            if (!allowed.has(ext)) {
                console.log("Wrong file format")
                throw createError({
                    statusCode: 400,
                    message: 'Wrong file format'
                });
            }
        } else if (part.name) {
            // These are the additional fields (title, minZoom, maxZoom, format, etc.)
            metadata[part.name] = part.data.toString('utf-8');
            // Now you can access your fields like:
        }
    });
    const title = metadata.title;
    const minZoom = metadata.minZoom;
    const maxZoom = metadata.maxZoom;
    const format = metadata.format;
    try {
        imageToTiles(filepath, title, minZoom, maxZoom, format);
    } catch (err) {
        console.error('imageToTiles failed:', err);
    }
    return 200;
});
