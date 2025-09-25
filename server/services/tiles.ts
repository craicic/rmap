class Tiles {
    constructor(file: File) {
        this.input = file;
    }

    input: File;

    imageToTiles(title: string, maxZoom: number, minZoom: number, format: Format) {

    }
}

export default class;

enum Format {
    JPEG = 'jpeg',
    PNG = 'PNG',
    AVIF = 'avif',
    WEBP = 'webp'
}