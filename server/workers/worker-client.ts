// import path from 'node:path';
// import { fileURLToPath } from 'node:url';

// TODO: fix worker path issue with Nuxt 4
// https://github.com/nuxt/nuxt/discussions/16296
import { Worker } from 'node:worker_threads';

import workerPath from './worker.js?worker&url';

const run = (
	filepath: string,
	name: string,
	minZoom: string,
	maxZoom: string,
	format: string,
): Promise<string> => {
	// const __filename = fileURLToPath(import.meta.url);
	// const __dirname = path.dirname(__filename);
	// const workerPath = path.resolve(__dirname, './worker.js');
	console.log('Main thread started.', workerPath);

	return new Promise((resolve, reject) => {
		const worker = new Worker(workerPath, {
			workerData: { filepath, name, minZoom, maxZoom, format },
			execArgv: ['-r', 'ts-node/register'],
		});

		worker.on('message', (res: string) => resolve(res));
		worker.on('error', reject);

		worker.on('exit', (code) => {
			if (code !== 0) {
				reject(new Error(`Worker stopped with exit code ${code}`));
			}
		});
	});
};

export default run;
