import {exec} from 'child_process';
import {randomDirName} from '~~/server/services/generator';
import fs from 'fs';

export default function imageToTiles(filepath: string, title: string, minZoom: number, maxZoom: number, format: string) {
    console.log('filePath = ' + filepath)
    console.log('title = ' + title)
    console.log('format = ' + format)

    const outDir = 'public/maps/' + randomDirName(6);
    fs.mkdir(outDir, {recursive: true}, (err) => {
        if (err) throw err;
    });

    const cmd = [
        'source ~/Development/env/miniconda3/etc/profile.d/conda.sh',
        'conda activate geospatial',
        `gdal2tiles.py --xyz -p raster --zoom=${minZoom}-${maxZoom} --webviewer=leaflet "${filepath}" "${outDir}/"`
    ].join(' && ');
    // Use exec with bash -lc to load conda and run command
    exec(cmd, {shell: '/usr/bin/bash'}, (error, stdout, stderr) => {
        if (stdout) console.log(`stdout: ${stdout}`);
        if (stderr) console.error(`stderr: ${stderr}`);
        if (error) {
            console.error('gdal2tiles failed:', error);
            fs.rmdir(outDir, (err) => {
                if (err) throw err;
            })
            throw error;
        }
        console.log('gdal2tiles completed successfully');
    });
    return outDir;
}