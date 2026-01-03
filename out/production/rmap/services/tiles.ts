import {exec} from 'child_process';
import fs from 'fs';
import {randomDirName} from '~~/server/services/generator';

export default function imageToTiles(
    filepath: string,
    name: string,
    minZoom: string,
    maxZoom: string,
    format: string,
) {
    const config = useRuntimeConfig();
    const dirName = `${name}-` + randomDirName(6);
    const outDir = `${config.public.mapsDir}` + dirName;

    fs.mkdir(outDir, {recursive: true}, (err) => {
        if (err) throw err;
    });

    const cmd = [
        `source ${config.public.minicondaDir}etc/profile.d/conda.sh`,
        'conda activate geospatial',
        `gdal2tiles.py --xyz -p raster --zoom=${minZoom}-${maxZoom} --webviewer=leaflet "${filepath}" "${outDir}/" --tiledriver="${format.toUpperCase()}"`,
    ].join(' && ');
    // Use exec with bash -lc to load conda and run command
    exec(cmd, {shell: '/usr/bin/bash'}, (error, stdout, stderr) => {
        if (stdout) console.log(`stdout: ${stdout}`);
        if (stderr) console.error(`stderr: ${stderr}`);
        if (error) {
            console.error('gdal2tiles failed:', error);
            fs.rmdir(outDir, (err) => {
                if (err) throw err;
            });
            throw error;
        }
        console.log('gdal2tiles completed successfully');
    });
    return dirName;
}
