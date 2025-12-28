import fs from 'fs';
import os from 'os';
import path from 'path';
import { env } from 'process';
import generateTiles from '../services/tiles-sharp';
import type { TileMapData } from '#shared/info';
import sharp from 'sharp';

export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event);
    const config = useRuntimeConfig();

    if (!formData) {
        console.log('No form data received');
        throw createError({
            statusCode: 400,
            message: 'No form data received',
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
                type: part.type,
            };
            if (!file || !file.type || !file.filename) return;
            // Normalize MIME to canonical extension
            const mime = file.type.toLowerCase();
            const mimeToExt: Record<string, string> = {
                'image/png': 'png',
                'image/jpeg': 'jpeg',
                'image/jpg': 'jpeg',
                'image/webp': 'webp',
                'image/avif': 'avif',
            };
            const ext = mimeToExt[mime] ?? 'bin';

            filepath = path.join(tempDirPath, file.filename);
            fs.writeFileSync(filepath, file.data);

            // Store the actual saved filepath
            metadata['uploadedFilePath'] = filepath;

            const allowed = new Set(['png', 'jpeg', 'webp', 'avif']);
            if (!allowed.has(ext)) {
                console.log('Wrong file format');
                throw createError({
                    statusCode: 400,
                    message: 'Wrong file format',
                });
            }
        } else if (part.name) {
            // These are the additional fields (name, minZoom, maxZoom, format, etc.)
            metadata[part.name] = part.data.toString('utf-8');
            console.log(part.name + '=' + metadata[part.name]);
        }
    });

    // Ensure we have an uploaded file
    if (!metadata['uploadedFilePath'] || !fs.existsSync(metadata['uploadedFilePath'])) {
        console.log('No uploaded file found');
        throw createError({
            statusCode: 400,
            message: 'No uploaded file found',
        });
    }

    // Read actual dimensions from the uploaded file
    let detectedWidth = 0;
    let detectedHeight = 0;
    try {
        const meta = await sharp(metadata['uploadedFilePath']).metadata();
        detectedWidth = meta.width || 0;
        detectedHeight = meta.height || 0;
        console.log(`Detected dimensions: ${detectedWidth}x${detectedHeight}`);
    } catch (err) {
        console.error('Failed to read image metadata via sharp:', err);
        throw createError({
            statusCode: 400,
            message: 'Failed to read image metadata',
        });
    }

    if (detectedWidth === 0 || detectedHeight === 0) {
        throw createError({
            statusCode: 400,
            message: 'Invalid image dimensions',
        });
    }

    const inputData: TileMapData = {
        originalFile: {
            name: metadata.name || 'unnamed',
            location: metadata['uploadedFilePath'], // Use the temp filepath as input
            format: metadata.format || 'webp',
            width: detectedWidth,
            height: detectedHeight,
        },
        config: {
            minZoom: Number(metadata.minZoom) || 0,
            maxZoom: Number(metadata.maxZoom) || 4,
            format: metadata.format || 'webp',
        },
    };

    let tileMapData;
    try {
        console.log('input:' + inputData.originalFile.location);
        console.log(`Dimensions: ${inputData.originalFile.width}x${inputData.originalFile.height}`);
        tileMapData = await generateTiles(inputData);
        console.log('output:', tileMapData);
    } catch (err) {
        console.error('generateTiles failed:', err);
        throw createError({
            statusCode: 500,
            message: 'Failed to generate tiles',
        });
    }

    const data = JSON.parse(fs.readFileSync(env.MAPS_DIR + 'metadata.json', 'utf8'));
    console.log(data);
    if (!tileMapData) return 400;

    data.maps.push(tileMapData);

    fs.writeFile(config.public.mapsDir + 'metadata.json', JSON.stringify(data), (err) => {
        if (err) {
            console.log('Error writing file:', err);
        } else {
            console.log('Successfully appended metadata.json file');
        }
    });

    return { id: data.maps.length - 1 };
});
