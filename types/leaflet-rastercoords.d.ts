declare module 'leaflet-rastercoords' {
    export default class RasterCoords {
        constructor(map: L.Map, size: [number, number]);

        unproject(point: [number, number]): L.LatLng;
        getMaxBounds(): L.LatLngBoundsExpression;

        // Either a function or a number (lib varies)
        zoomLevel?: number | (() => number);
    }
}

// Augment Leaflet: add a named export `RasterCoords`
declare module 'leaflet' {
    export const RasterCoords: import('leaflet-rastercoords').default;
}
