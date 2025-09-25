import type Format from '~/shared/enum/format.enum';
import {exec} from 'child_process';


export default function imageToTiles(filePath: string, title: string, maxZoom: number, minZoom: number, format: Format) {

    exec('conda activate geospatial', (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            return;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}