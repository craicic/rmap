import crypto from 'crypto';

export function randomDirName(length = 6) {
	return crypto
		.randomBytes(length)
		.toString('base64')
		.replace(/[^a-wyzA-WYZ0-9]/g, 'a')
		.slice(0, length);
}
