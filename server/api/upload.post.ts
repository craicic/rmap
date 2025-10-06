import type { mapInfo } from '#shared/info';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { env } from 'process';
import generateTiles from '../services/tiles-sharp';

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
			};
			const ext = mimeToExt[mime] ?? 'bin';

			filepath = path.join(tempDirPath, file.filename);
			fs.writeFileSync(filepath, file.data);
			const allowed = new Set(['png', 'jpeg', 'webp']);
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
			console.log(metadata[part.name]);
			// Now you can access your fields like:
		}
	});

	const info: mapInfo = {
		name: metadata.name,
		minZoom: metadata.minZoom,
		maxZoom: metadata.maxZoom,
		format: metadata.format,
		location: '',
		width: metadata.width,
		height: metadata.height,
	};
	try {
		// info.location = imageToTiles(filepath, info.name, info.minZoom, info.maxZoom, info.format);
		info.location = await generateTiles(
			filepath,
			info.name,
			info.minZoom,
			info.maxZoom,
			info.format,
            info.width,
            info.height
		);
	} catch (err) {
		console.error('imageToTiles failed:', err);
	}

	const data = JSON.parse(fs.readFileSync(env.MAPS_DIR + 'metadata.json', 'utf8'));

	data.maps.push(info);

	fs.writeFile(config.public.mapsDir + 'metadata.json', JSON.stringify(data), (err) => {
		if (err) {
			console.log('Error writing file:', err);
		} else {
			console.log('Successfully wrote file');
		}
	});
	return 200;
});
