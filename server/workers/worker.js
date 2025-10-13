import { parentPort, workerData } from 'node:worker_threads';
import generateTiles from '../services/tiles-sharp';

const { filepath, name, minZoom, maxZoom, format } = workerData;

(async () => {
	const dirName = await generateTiles(filepath, name, minZoom, maxZoom, format);
	if (parentPort)
		parentPort.postMessage(dirName); // Send result back to main
	else throw new Error('No parent port available');
})();
