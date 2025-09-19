import path from 'path';
import fs from 'fs';

export default defineEventHandler(async (event) => {
    const files = await readMultipartFormData(event);
    files?.forEach((file) => {
            const filePath = path.join(process.cwd(), 'public', file.filename as string)
            fs.writeFileSync(filePath, file.data)
        }
    );
    return 200;
})