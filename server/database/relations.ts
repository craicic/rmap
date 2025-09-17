import { relations } from "drizzle-orm/relations";
import { map, marker, room, user, layer, roomUsers, image, markerImages } from "./schema";

export const markerRelations = relations(marker, ({one}) => ({
	map: one(map, {
		fields: [marker.idMap],
		references: [map.id]
	}),
}));

export const mapRelations = relations(map, ({one, many}) => ({
	markers: many(marker),
	room: one(room, {
		fields: [map.idRoom],
		references: [room.id]
	}),
	layers: many(layer),
}));

export const roomRelations = relations(room, ({one, many}) => ({
	maps: many(map),
	user: one(user, {
		fields: [room.idOwner],
		references: [user.id]
	}),
	roomUsers: many(roomUsers),
}));

export const userRelations = relations(user, ({many}) => ({
	rooms: many(room),
	roomUsers: many(roomUsers),
}));

export const layerRelations = relations(layer, ({one}) => ({
	map: one(map, {
		fields: [layer.idMap],
		references: [map.id]
	}),
}));

export const roomUsersRelations = relations(roomUsers, ({one}) => ({
	room: one(room, {
		fields: [roomUsers.idRoom],
		references: [room.id]
	}),
	user: one(user, {
		fields: [roomUsers.idPlayer],
		references: [user.id]
	}),
}));

export const markerImagesRelations = relations(markerImages, ({one}) => ({
	image_idImage: one(image, {
		fields: [markerImages.idImage],
		references: [image.id],
		relationName: "markerImages_idImage_image_id"
	}),
	image_idMarker: one(image, {
		fields: [markerImages.idMarker],
		references: [image.id],
		relationName: "markerImages_idMarker_image_id"
	}),
}));

export const imageRelations = relations(image, ({many}) => ({
	markerImages_idImage: many(markerImages, {
		relationName: "markerImages_idImage_image_id"
	}),
	markerImages_idMarker: many(markerImages, {
		relationName: "markerImages_idMarker_image_id"
	}),
}));