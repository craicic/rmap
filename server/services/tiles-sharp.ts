
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
    height: string,
) {
    const config = useRuntimeConfig();
    const dirName = `${name}-` + randomDirName(6);

    const outDir = `${config.public.mapsDir}` + dirName;

    fs.mkdir(outDir, { recursive: true }, (err) => {
        if (err) throw err;
    });

    const min = parseInt(minZoom);
    const max = parseInt(maxZoom);
    const originalWidth = parseInt(width);
    const originalHeight = parseInt(height);

    // Calculate the size at max zoom based on larger dimension
    const maxDimension = Math.max(originalWidth, originalHeight);
    const maxScale = Math.pow(2, max);
    const tilesAtMaxZoom = maxScale; // number of tiles along the larger axis
    const maxZoomSize = tilesAtMaxZoom * tileSize;

    // Calculate aspect-correct dimensions at max zoom
    const aspectRatio = originalWidth / originalHeight;
    let maxZoomWidth, maxZoomHeight;

    if (originalWidth >= originalHeight) {
        maxZoomWidth = maxZoomSize;
        maxZoomHeight = Math.round(maxZoomSize / aspectRatio);
    } else {
        maxZoomHeight = maxZoomSize;
        maxZoomWidth = Math.round(maxZoomSize * aspectRatio);
    }

    const zoomLevels = Array.from({ length: max + 1 }, (_, i) => i);

    for (const z of zoomLevels) {
        const scale = Math.pow(2, z);
        const zoomRatio = scale / maxScale;

        // Scale dimensions proportionally for this zoom level
        const scaledWidth = Math.ceil(maxZoomWidth * zoomRatio);
        const scaledHeight = Math.ceil(maxZoomHeight * zoomRatio);

        // For square tile pyramid: tiles per side = 2^z
        const tilesPerSide = scale;

        console.log(`Zoom ${z}: ${scaledWidth}x${scaledHeight} in ${tilesPerSide}x${tilesPerSide} grid`);

        // Resize image to match zoom level
        const buffer = await sharp(filepath)
            .resize(scaledWidth, scaledHeight, {
                fit: 'fill',
            })
            .toBuffer();

        // Generate all tiles in the square grid (even empty ones)
        for (let x = 0; x < tilesPerSide; x++) {
            for (let y = 0; y < tilesPerSide; y++) {
                const tileFolder = path.join(outDir, `${z}`, `${x}`);
                fs.mkdirSync(tileFolder, { recursive: true });

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

                    // Extend to 256x256 with transparent background if needed
                    await sharp(extractedTile)
                        .extend({
                            top: 0,
                            left: 0,
                            bottom: tileSize - extractHeight,
                            right: tileSize - extractWidth,
                            background: { r: 0, g: 0, b: 0, alpha: 0 },
                        })
                        .toFile(path.join(tileFolder, `${y}.${format}`));
                } else {
                    // Create empty transparent tile for areas outside the image
                    await sharp({
                        create: {
                            width: tileSize,
                            height: tileSize,
                            channels: 4,
                            background: { r: 0, g: 0, b: 0, alpha: 0 },
                        },
                    }).toFile(path.join(tileFolder, `${y}.${format}`));
                }
            }
        }
    }
    return dirName;
}