import path from 'path';
import fs from 'fs';

export default defineEventHandler(async (event) => {
    const files = await readMultipartFormData(event);
    files?.forEach((file) => {
            console.log(process.cwd(), 'public/imported', file.filename as string);
            const filePath = path.join(process.cwd(), 'public/imported', file.filename as string)
            fs.writeFileSync(filePath, file.data)
        }
    );
    return 200;
})