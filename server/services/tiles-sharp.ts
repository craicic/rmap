import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {randomDirName} from '~~/server/services/generator';
import {TileMapData} from '#shared/info';

// Source map (large PNG/JPG/etc)

// Output folder
const tileSize = 256;

export default async function generateTiles(data: TileMapData) {
    const config = useRuntimeConfig();

    // Validate input
    if (!data.originalFile.location || !fs.existsSync(data.originalFile.location)) {
        throw new Error(`Input file not found: ${data.originalFile.location}`);
    }

    if (data.originalFile.width <= 0 || data.originalFile.height <= 0) {
        throw new Error(`Invalid dimensions: ${data.originalFile.width}x${data.originalFile.height}`);
    }

    // Generate output directory name
    const outputDirName = `${data.originalFile.name}-${randomDirName(6)}`;
    const outDir = `${config.public.mapsDir}${outputDirName}`;

    fs.mkdirSync(outDir, {recursive: true});

    const min = data.config.minZoom;
    const max = data.config.maxZoom;
    const originalWidth = data.originalFile.width;
    const originalHeight = data.originalFile.height;

    // Calculate the required max zoom so that zoom 0 fits in a single 256×256 tile
    const maxDimension = Math.max(originalWidth, originalHeight);
    const requiredMaxZoom = Math.ceil(Math.log2(maxDimension / tileSize));

    // Use the larger of user-specified max or required max
    const actualMaxZoom = Math.max(max, requiredMaxZoom);

    if (actualMaxZoom > max) {
        console.warn(`Max zoom adjusted from ${max} to ${actualMaxZoom} to fit image in tile pyramid`);
    }

    // At actualMaxZoom, calculate dimensions that align with tile boundaries
    const maxScale = Math.pow(2, actualMaxZoom);
    const zoom0Scale = tileSize; // At zoom 0, largest dimension = 256px

    // Scale original dimensions so the larger dimension at zoom 0 = 256px
    const scaleFactor = zoom0Scale / maxDimension;
    const zoom0Width = Math.ceil(originalWidth * scaleFactor);
    const zoom0Height = Math.ceil(originalHeight * scaleFactor);

    // Max zoom dimensions are zoom 0 dimensions × 2^actualMaxZoom
    const maxZoomWidth = zoom0Width * maxScale;
    const maxZoomHeight = zoom0Height * maxScale;

    // Precompute integer zoom levels
    const zoomLevels = Array.from({length: actualMaxZoom + 1}, (_, i) => i);

    for (const z of zoomLevels) {
        const scale = Math.pow(2, z);
        const zoomRatio = scale / maxScale;

        // Derive dimensions for this zoom level from the original size
        const scaledWidth = Math.ceil(maxZoomWidth * zoomRatio);
        const scaledHeight = Math.ceil(maxZoomHeight * zoomRatio);

        // Calculate tiles needed to cover the actual image dimensions
        const tilesX = Math.ceil(scaledWidth / tileSize);
        const tilesY = Math.ceil(scaledHeight / tileSize);

        console.log(`Zoom ${z}: ${scaledWidth}x${scaledHeight} in ${tilesX}x${tilesY} grid`);

        // Read from the ORIGINAL uploaded file location
        const buffer = await sharp(data.originalFile.location)
            .resize(scaledWidth, scaledHeight, {
                fit: 'fill',
            })
            .toBuffer();


        // Generate all tiles in the square grid (even empty ones)
        for (let x = 0; x < scale; x++) {
            for (let y = 0; y < scale; y++) {
                const tileFolder = path.join(outDir, `${z}`, `${x}`);
                fs.mkdirSync(tileFolder, {recursive: true});

                const tileLeft = x * tileSize;
                const tileTop = y * tileSize;

                // Check if this tile overlaps with actual image data
                const hasImageData = tileLeft < scaledWidth && tileTop < scaledHeight;

                if (hasImageData) {
                    // Calculate actual extract dimensions (may be smaller at edges)
                    const extractWidth = Math.min(tileSize, scaledWidth - tileLeft);
                    const extractHeight = Math.min(tileSize, scaledHeight - tileTop);

                    // Extract the tile from the buffer
                    const extractedTile = await sharp(buffer)
                        .extract({
                            left: tileLeft,
                            top: tileTop,
                            width: extractWidth,
                            height: extractHeight,
                        })
                        .toBuffer();

                    // Extend to 256x256 with a transparent background if needed
                    await sharp(extractedTile)
                        .extend({
                            top: 0,
                            left: 0,
                            bottom: tileSize - extractHeight,
                            right: tileSize - extractWidth,
                            background: {r: 0, g: 0, b: 0, alpha: 0},
                        })
                        .toFile(path.join(tileFolder, `${y}.${data.config.format}`));
                } else {
                    // Create an empty transparent tile for areas outside the image
                    await sharp({
                        create: {
                            width: tileSize,
                            height: tileSize,
                            channels: 4,
                            background: {r: 0, g: 0, b: 0, alpha: 0},
                        },
                    }).toFile(path.join(tileFolder, `${y}.${data.config.format}`));
                }
            }
        }
    }
    data.outTileMap = {
        location: outputDirName, // Store relative path for metadata.json
        maxZoomWidth: maxZoomWidth,
        maxZoomHeight: maxZoomHeight,
        actualMaxZoom: actualMaxZoom
    };
    return data;
}