import { relations } from "drizzle-orm/relations";
import { room, map, users, layer, marker, image, markerImages, roomUsers } from "./schema";

export const mapRelations = relations(map, ({one, many}) => ({
	room: one(room, {
		fields: [map.fkRoom],
		references: [room.id]
	}),
	layers: many(layer),
	markers: many(marker),
}));

export const roomRelations = relations(room, ({one, many}) => ({
	maps: many(map),
	user: one(users, {
		fields: [room.fkOwner],
		references: [users.id]
	}),
	roomUsers: many(roomUsers),
}));

export const usersRelations = relations(users, ({many}) => ({
	rooms: many(room),
	roomUsers: many(roomUsers),
}));

export const layerRelations = relations(layer, ({one}) => ({
	map: one(map, {
		fields: [layer.fkMap],
		references: [map.id]
	}),
}));

export const markerRelations = relations(marker, ({one}) => ({
	map: one(map, {
		fields: [marker.fkMap],
		references: [map.id]
	}),
}));

export const markerImagesRelations = relations(markerImages, ({one}) => ({
	image_fkImage: one(image, {
		fields: [markerImages.fkImage],
		references: [image.id],
		relationName: "markerImages_fkImage_image_id"
	}),
	image_fkMarker: one(image, {
		fields: [markerImages.fkMarker],
		references: [image.id],
		relationName: "markerImages_fkMarker_image_id"
	}),
}));

export const imageRelations = relations(image, ({many}) => ({
	markerImages_fkImage: many(markerImages, {
		relationName: "markerImages_fkImage_image_id"
	}),
	markerImages_fkMarker: many(markerImages, {
		relationName: "markerImages_fkMarker_image_id"
	}),
}));

export const roomUsersRelations = relations(roomUsers, ({one}) => ({
	room: one(room, {
		fields: [roomUsers.fkRoom],
		references: [room.id]
	}),
	user: one(users, {
		fields: [roomUsers.fkPlayer],
		references: [users.id]
	}),
}));