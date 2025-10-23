import { pgTable, foreignKey, integer, varchar, text, boolean, primaryKey, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const room = pgTable("room", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	url: varchar({ length: 1000 }),
	fkOwner: integer("fk_owner").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fkOwner],
			foreignColumns: [users.id],
			name: "r_fk_owner"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
});

export const map = pgTable("map", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	minZoom: integer("min_zoom"),
	maxZoom: integer("max_zoom"),
	widthAtMaxZoom: integer("width_at_max_zoom"),
	heightAtMaxZoom: integer("height_at_max_zoom"),
	extension: varchar({ length: 10 }),
	fkRoom: integer("fk_room").notNull(),
	fkFile: integer("fk_file").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fkRoom],
			foreignColumns: [room.id],
			name: "m_fk_room"
		}),
	foreignKey({
			columns: [table.fkFile],
			foreignColumns: [image.id],
			name: "m_fk_file"
		}),
]);

export const layer = pgTable("layer", {
	id: serial().primaryKey().notNull(),
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

export const image = pgTable("image", {
	id: serial().primaryKey().notNull(),
	path: text(),
	title: varchar({ length: 255 }),
	width: integer(),
	height: integer(),
	extension: varchar({ length: 255 }),
});

export const marker = pgTable("marker", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	description: text(),
	x: integer().notNull(),
	y: integer().notNull(),
	isShown: boolean("is_shown").notNull(),
	fkMap: integer("fk_map").notNull(),
	fkImage: integer("fk_image"),
}, (table) => [
	foreignKey({
			columns: [table.fkMap],
			foreignColumns: [map.id],
			name: "m_fk_map"
		}),
	foreignKey({
			columns: [table.fkImage],
			foreignColumns: [image.id],
			name: "m_fk_image"
		}),
]);

export const roomUsers = pgTable("room_users", {
	fkRoom: integer("fk_room").notNull(),
	fkPlayer: integer("fk_player").notNull(),
	characterName: varchar("character_name", { length: 255 }),
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
