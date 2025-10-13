import { pgTable, foreignKey, integer, varchar, boolean, text, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const map = pgTable("map", {
	id: integer().primaryKey().notNull(),
	title: varchar({ length: 255 }),
	fkRoom: integer("fk_room").notNull(),
	maxZoom: integer("max_zoom"),
	minZoom: integer("min_zoom"),
}, (table) => [
	foreignKey({
			columns: [table.fkRoom],
			foreignColumns: [room.id],
			name: "m_fk_room"
		}),
]);

export const room = pgTable("room", {
	id: integer().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	url: varchar({ length: 255 }),
	fkOwner: integer("fk_owner").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fkOwner],
			foreignColumns: [users.id],
			name: "r_fk_owner"
		}),
]);

export const layer = pgTable("layer", {
	id: integer().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	zIndex: integer("z_index"),
	isShown: boolean("is_shown").notNull(),
	fkMap: integer("fk_map").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fkMap],
			foreignColumns: [map.id],
			name: "l_fk_map"
		}),
]);

export const users = pgTable("users", {
	id: integer().primaryKey().notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }),
});

export const image = pgTable("image", {
	id: integer().primaryKey().notNull(),
	path: varchar({ length: 1000 }).notNull(),
	title: varchar({ length: 255 }),
});

export const marker = pgTable("marker", {
	id: integer().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	description: text(),
	x: integer().notNull(),
	y: integer().notNull(),
	isShown: boolean("is_shown").notNull(),
	fkMap: integer("fk_map").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fkMap],
			foreignColumns: [map.id],
			name: "m_fk_map"
		}),
]);

export const markerImages = pgTable("marker_images", {
	fkMarker: integer("fk_marker").notNull(),
	fkImage: integer("fk_image").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fkImage],
			foreignColumns: [image.id],
			name: "mi_fk_image"
		}),
	foreignKey({
			columns: [table.fkMarker],
			foreignColumns: [image.id],
			name: "mi_fk_marker"
		}),
	primaryKey({ columns: [table.fkMarker, table.fkImage], name: "marker_images_pkey"}),
]);

export const roomUsers = pgTable("room_users", {
	fkRoom: integer("fk_room").notNull(),
	fkPlayer: integer("fk_player").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fkRoom],
			foreignColumns: [room.id],
			name: "ru_fk_room"
		}),
	foreignKey({
			columns: [table.fkPlayer],
			foreignColumns: [users.id],
			name: "ru_fk_player"
		}),
	primaryKey({ columns: [table.fkRoom, table.fkPlayer], name: "room_users_pkey"}),
]);
