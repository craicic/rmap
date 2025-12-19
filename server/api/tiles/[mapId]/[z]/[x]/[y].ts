import { getQuery, getRouterParam, H3Event } from 'h3';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
	const req = parseTileRequest(event);
	const fileExt = req.ext ?? 'png';
	const filePath = path.join(
		process.cwd(),
		'storage',
		'maps',
		String(req.mapId),
		String(req.z),
		String(req.x),
		`${req.y}.${fileExt}`,
	);

	return await fs.promises.readFile(filePath);
});

// Supported file extensions
const SupportedExtSchema = z.enum(['avif', 'png', 'webp']);
type SupportedExt = z.infer<typeof SupportedExtSchema>;

type TileRequest = {
	z: number;
	x: number;
	y: number;
	mapId: number;
	ext?: SupportedExt; // file extension (query: ?ext=avif|png|webp)
};

const TileParamsSchema = z.object({
	z: z.coerce.number().int().nonnegative(),
	x: z.coerce.number().int().nonnegative(),
	y: z.coerce.number().int().nonnegative(),
	mapId: z.coerce.number().int().nonnegative(),
	ext: SupportedExtSchema.optional(),
});

function parseTileRequest(event: H3Event): TileRequest {
	const zStr = getRouterParam(event, 'z');
	const xStr = getRouterParam(event, 'x');
	const yStr = getRouterParam(event, 'y');
	const mapIdStr = getRouterParam(event, 'mapId');

	if (!zStr || !xStr || !yStr || !mapIdStr) {
		throw createError({ statusCode: 400, message: 'Missing parameters' });
	}

	const q = getQuery(event);
	const extRaw = (typeof q.ext === 'string' ? q.ext : undefined)?.trim().toLowerCase() || undefined;

	const parsed = TileParamsSchema.safeParse({
		z: zStr,
		x: xStr,
		y: yStr,
		mapId: mapIdStr,
		ext: extRaw,
	});

	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			message: 'Invalid parameters',
			data: parsed.error.flatten(),
		});
	}

	return parsed.data;
}
