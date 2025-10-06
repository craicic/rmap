import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { randomDirName } from '~~/server/services/generator';

// Source map (large PNG/JPG/etc)

// Output folder
const tileSize = 256;


export default async function generateTiles(
    filepath: string,
    name: string,
    minZoom: string,
    maxZoom: string,
    format: string,
    width: string,
    height: string
) {
    const config = useRuntimeConfig();
    const dirName = `${name}-` + randomDirName(6);

    const outDir = `${config.public.mapsDir}` + dirName;

    fs.mkdir(outDir, { recursive: true }, (err) => {
        if (err) throw err;
    });

    const originalWidth = parseInt(width);
    const originalHeight = parseInt(height);

    const zoomLevels = Array.from({ length: parseInt(maxZoom) + 1 }, (_, i) => i);

    for (const z of zoomLevels) {
        const scale = Math.pow(2, z);

        // At max zoom, calculate how large the image should be
        const maxZoomLevel = parseInt(maxZoom);
        const maxScale = Math.pow(2, maxZoomLevel);

        // Use the larger dimension to define the square pyramid
        const maxDimension = Math.max(originalWidth, originalHeight);
        const scaleFactor = (maxScale * tileSize) / maxDimension;

        const scaledWidth = Math.round(originalWidth * scaleFactor * (scale / maxScale));
        const scaledHeight = Math.round(originalHeight * scaleFactor * (scale / maxScale));

        // The pyramid is always square, so use scale for both dimensions
        const tilesPerSide = scale;

        // Resize image to match zoom level
        const buffer = await sharp(filepath)
            .resize(scaledWidth, scaledHeight, {
                fit: 'fill'
            })
            .toBuffer();

        // Generate all tiles in the square grid
        for (let x = 0; x < tilesPerSide; x++) {
            for (let y = 0; y < tilesPerSide; y++) {
                const tileFolder = path.join(outDir, `${z}`, `${x}`);
                fs.mkdirSync(tileFolder, { recursive: true });

                // Check if this tile contains any image data
                const tileLeft = x * tileSize;
                const tileTop = y * tileSize;
                const tileRight = tileLeft + tileSize;
                const tileBottom = tileTop + tileSize;

                // Check if tile overlaps with the actual image
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

                    // Extend to 256x256 with transparent background if needed
                    await sharp(extractedTile)
                        .extend({
                            top: 0,
                            left: 0,
                            bottom: tileSize - extractHeight,
                            right: tileSize - extractWidth,
                            background: { r: 0, g: 0, b: 0, alpha: 0 }
                        })
                        .toFile(path.join(tileFolder, `${y}.${format}`));
                } else {
                    // Create a fully transparent tile
                    await sharp({
                        create: {
                            width: tileSize,
                            height: tileSize,
                            channels: 4,
                            background: { r: 0, g: 0, b: 0, alpha: 0 }
                        }
                    })
                        .toFile(path.join(tileFolder, `${y}.${format}`));
                }
            }
        }
    }
    return dirName;
}