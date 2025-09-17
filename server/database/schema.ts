import { pgTable, foreignKey, bigint, varchar, boolean, primaryKey } from "drizzle-orm/pg-core"



export const marker = pgTable("marker", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: varchar({ length: 255 }),
	description: varchar({ length: 2048 }),
	x: bigint({ mode: "number" }).notNull(),
	y: bigint({ mode: "number" }).notNull(),
	isShown: boolean("is_shown"),
	idMap: bigint("id_map", { mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.idMap],
			foreignColumns: [map.id],
			name: "marker_id_map_foreign"
		}),
]);

export const map = pgTable("map", {
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	title: varchar({ length: 255 }),
	idRoom: bigint("id_room", { mode: "number" }).notNull(),
	maxZoom: bigint("max_zoom", { mode: "number" }).notNull(),
	minZoom: bigint("min_zoom", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idRoom],
			foreignColumns: [room.id],
			name: "map_id_room_foreign"
		}),
]);

export const image = pgTable("image", {
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	path: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 255 }),
});

export const room = pgTable("room", {
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: varchar({ length: 255 }),
	url: varchar({ length: 255 }),
	idOwner: bigint("id_owner", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idOwner],
			foreignColumns: [user.id],
			name: "room_id_owner_foreign"
		}),
]);

export const layer = pgTable("layer", {
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	name: varchar({ length: 255 }),
	zIndex: bigint("z_index", { mode: "number" }),
	isShown: boolean("is_shown").notNull(),
	idMap: bigint("id_map", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idMap],
			foreignColumns: [map.id],
			name: "layer_id_map_foreign"
		}),
]);

export const user = pgTable("users", {
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }),
});

export const roomUsers = pgTable("room_users", {
	idRoom: bigint("id_room", { mode: "number" }).notNull(),
	idPlayer: bigint("id_player", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idRoom],
			foreignColumns: [room.id],
			name: "room_users_id_room_foreign"
		}),
	foreignKey({
			columns: [table.idPlayer],
			foreignColumns: [user.id],
			name: "room_users_id_player_foreign"
		}),
	primaryKey({ columns: [table.idRoom, table.idPlayer], name: "room_users_pkey"}),
]);

export const markerImages = pgTable("marker_images", {
	idMarker: bigint("id_marker", { mode: "number" }).notNull(),
	idImage: bigint("id_image", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idImage],
			foreignColumns: [image.id],
			name: "image_id_foreign"
		}),
	foreignKey({
			columns: [table.idMarker],
			foreignColumns: [image.id],
			name: "marker_id_foreign"
		}),
	primaryKey({ columns: [table.idMarker, table.idImage], name: "marker_images_pkey"}),
]);
