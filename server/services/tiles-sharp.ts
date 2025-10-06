import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { randomDirName } from '~~/server/services/generator';

// Source map (large PNG/JPG/etc)

// Output folder
const tileSize = 256;

// Manually loop to create zoom levels
export default async function generateTiles(
	filepath: string,
	name: string,
	minZoom: string,
	maxZoom: string,
	format: string,
) {
	const config = useRuntimeConfig();
	const dirName = `${name}-` + randomDirName(6);

	const outDir = `${config.public.mapsDir}` + dirName;

	fs.mkdir(outDir, { recursive: true }, (err) => {
		if (err) throw err;
	});

	// Define zoom levels (example: 0 to 5)
	// const zoomLevels = [0, 1, 2, 3, 4, 5];
	const zoomLevels = new Array((parseInt(maxZoom) || 0) + 1).fill(0).map((_, i: number) => i);

	for (const z of zoomLevels) {
		const scale = Math.pow(2, z);
		const scaledWidth = 256 * scale;
		const scaledHeight = 256 * scale;

		// Resize image to match zoom level
		const buffer = await sharp(filepath).resize(scaledWidth, scaledHeight).toBuffer();

		for (let x = 0; x < scale; x++) {
			for (let y = 0; y < scale; y++) {
				const tileFolder = path.join(outDir, `${z}`, `${x}`);
				fs.mkdirSync(tileFolder, { recursive: true });

				await sharp(buffer)
					.extract({
						left: x * tileSize,
						top: y * tileSize,
						width: tileSize,
						height: tileSize,
					})
					.toFile(path.join(tileFolder, `${y}.${format}`));
			}
		}
	}
	return dirName;
}

// generateTiles().catch(console.error);
