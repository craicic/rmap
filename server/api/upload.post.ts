import path from 'path';
import process from 'process';
import fs from 'fs';
import makeId from '~/shared/services/generator';
import imageToTiles from '../services/tiles'
import Format from '~/shared/enum/format.enum';

export default defineEventHandler(async (event) => {
    const files = await readMultipartFormData(event);
    const dirPath = path.join(process.cwd(), 'storage', makeId(8));
    await fs.promises.mkdir(dirPath, {recursive: true});

    files?.forEach((file) => {
        const filePath = path.join(dirPath, file.filename as string)
        fs.writeFileSync(filePath, file.data);
        imageToTiles(filePath, file.filename as string, 0, 4, Format.WEBP);
    });

    return 200;
});

//fs.readFileSync(path.join(dirPath, file.name))