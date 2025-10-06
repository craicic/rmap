import { Worker } from 'worker_threads';
import ProjectFile from '../models/ProjectFile.js';

const getProjectFileById = async (id) => {
	return await ProjectFile.findById(id);
};

const updateProjectFileMetadatas = async (id, metadatas) => {
	await ProjectFile.findByIdAndUpdate(id, { metadatas });
};

export const runPdfToSvgWorker = async ({ id, filename }) => {
	const project = await getProjectFileById(id);

	// check conversion state
	if (!project) return;
	if (project?.metadatas?.svgConversion === 'fulfilled') return;
	if (project?.metadatas?.svgConversion === 'pending') return;

	// conversion pending
	const prevMetadatas = project?.metadatas || {};
	await updateProjectFileMetadatas(id, {
		...prevMetadatas,
		pages: null, // important for older files before svgengine deployment
		svgConversion: 'pending',
	});

	const worker = new Worker('~~/utils/workerPdfToSvg.js', {
		execArgv: [...process.execArgv, '--unhandled-rejections=strict'],
		workerData: { id, filename },
	});

	return new Promise((res, rej) => {
		// conversion fulfilled
		worker.on('message', async ({ metadatas }) => {
			console.log(metadatas);
			await updateProjectFileMetadatas(id, {
				...prevMetadatas,
				...metadatas,
				svgConversion: 'fulfilled',
			});

			worker.terminate();
			res({ svgConversion: 'fulfilled', metadatas });
		});
		// conversion rejected
		worker.on('error', async (message) => {
			await updateProjectFileMetadatas(id, {
				...prevMetadatas,
				svgConversion: 'rejected',
			});
			worker.terminate();
			rej({ svgConversion: 'rejected', message });
		});
	});
};

// TODO: provide a file to run test on
// const worker = new Worker("./utils/workerPdfToSvg.js", {
//     execArgv: [...process.execArgv, "--unhandled-rejections=strict"],
//     workerData: { filename: "1736174540909hXICQ9NcZl.pdf" },
// });
// worker.on("exit", async () => {
//     worker.terminate();
// });

// worker.on("error", async (e) => {
//     worker.terminate();
// });
