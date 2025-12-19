export interface mapInfo {
	name: string;
	minZoom: string;
	maxZoom: string;
	format: string;
	width: string;
	height: string;
	out: {
		location: string;
		maxZoomWidth: number;
		maxZoomHeight: number;
		actualMaxZoom: number;
	};
}

export interface TileMapData {
	originalFile: {
		name: string;
		location: string;
		format: string;
		width: number;
		height: number;
	};
	config: {
		minZoom: number;
		maxZoom: number;
		format: string;
	};
	outTileMap?: {
		location: string;
		maxZoomWidth: number;
		maxZoomHeight: number;
		actualMaxZoom: number;
	};
}
