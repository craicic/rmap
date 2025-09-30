import fs from 'fs';
import imageToTiles from '../services/tiles'
import path from 'path';
import os from 'os';

export default defineEventHandler(async (event) => {
    const files = await readMultipartFormData(event);
    const tempDirPath = fs.mkdtempSync(path.join(os.tmpdir(), 'rmap-'));
    console.log(tempDirPath)
    files?.forEach((file) => {
        if (!file || !file.type || !file.filename) return;

        // Normalize MIME to canonical extension
        const mime = file.type.toLowerCase();
        const mimeToExt: Record<string, string> = {
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/webp': 'webp',
        };
        const ext = mimeToExt[mime] ?? 'bin';

        const filepath: string = path.join(tempDirPath, file.filename);
        fs.writeFileSync(filepath, file.data);

        const allowed = new Set(['png', 'jpg', 'webp']);
        if (allowed.has(ext)) {
            try {
                console.log(imageToTiles(filepath, file.filename, 0, 4, ext));
            } catch (err) {
                console.error('imageToTiles failed:', err);
            }
        }
    });
    return 200;
});