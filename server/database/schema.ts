import { pgTable, serial, integer, customType, varchar, smallserial, text, boolean, foreignKey, primaryKey, pgSequence } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const imageIdSeq = pgSequence("image_id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, })
export const layerIdSeq = pgSequence("layer_id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, })
export const mapIdSeq = pgSequence("map_id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, })
export const markerIdSeq = pgSequence("marker_id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, })
export const roomIdSeq = pgSequence("room_id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, })
export const usersIdSeq = pgSequence("users_id_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, })

export const image = pgTable("image", {
	id: serial().primaryKey(),
	bytea: customType({ dataType: () => 'bytea' })(),
	width: integer(),
	height: integer(),
	extension: varchar({ length: 255 }),
});

export const layer = pgTable("layer", {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }),
	zIndex: integer("z_index"),
	isShown: boolean("is_shown").notNull(),
	fkMap: integer("fk_map").notNull().references(() => map.id),
});

export const map = pgTable("map", {
	id: serial().primaryKey(),
	title: varchar({ length: 255 }).notNull(),
	minZoom: integer("min_zoom"),
	maxZoom: integer("max_zoom"),
	widthAtMaxZoom: integer("width_at_max_zoom"),
	heightAtMaxZoom: integer("height_at_max_zoom"),
	extension: varchar({ length: 10 }),
	fkRoom: integer("fk_room").notNull().references(() => room.id, { onDelete: "cascade" } ),
	fkFile: integer("fk_file").notNull().references(() => image.id),
});

export const marker = pgTable("marker", {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }),
	description: text(),
	x: integer().notNull(),
	y: integer().notNull(),
	isShown: boolean("is_shown").notNull(),
	fkMap: integer("fk_map").notNull().references(() => map.id),
	fkImage: integer("fk_image").references(() => image.id, { onDelete: "cascade" } ),
});

export const room = pgTable("room", {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	url: varchar({ length: 1000 }),
	fkOwner: integer("fk_owner").notNull().references(() => users.id),
});

export const roomUsers = pgTable("room_users", {
	fkRoom: integer("fk_room").notNull().references(() => room.id),
	fkPlayer: integer("fk_player").notNull().references(() => users.id),
	characterName: varchar("character_name", { length: 255 }),
}, (table) => [
	primaryKey({ columns: [table.fkRoom, table.fkPlayer], name: "room_users_pkey"}),
]);

export const tile = pgTable("tile", {
	id: serial().primaryKey(),
	z: smallserial().notNull(),
	x: smallserial().notNull(),
	y: smallserial().notNull(),
	bytea: customType({ dataType: () => 'bytea' })().notNull(),
	fkMap: integer("fk_map").notNull().references(() => map.id),
});

export const users = pgTable("users", {
	id: serial().primaryKey(),
	username: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }),
});