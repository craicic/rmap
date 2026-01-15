import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	layer: {
		map: r.one.map({
			from: r.layer.fkMap,
			to: r.map.id
		}),
	},
	map: {
		layers: r.many.layer(),
		images: r.many.image(),
		tiles: r.many.tile(),
	},
	image: {
		rooms: r.many.room({
			from: r.image.id.through(r.map.fkFile),
			to: r.room.id.through(r.map.fkRoom)
		}),
		maps: r.many.map({
			from: r.image.id.through(r.marker.fkImage),
			to: r.map.id.through(r.marker.fkMap)
		}),
	},
	room: {
		images: r.many.image(),
		user: r.one.users({
			from: r.room.fkOwner,
			to: r.users.id,
			alias: "room_fkOwner_users_id"
		}),
		users: r.many.users({
			alias: "users_id_room_id_via_roomUsers"
		}),
	},
	users: {
		roomsFkOwner: r.many.room({
			alias: "room_fkOwner_users_id"
		}),
		roomsViaRoomUsers: r.many.room({
			from: r.users.id.through(r.roomUsers.fkPlayer),
			to: r.room.id.through(r.roomUsers.fkRoom),
			alias: "users_id_room_id_via_roomUsers"
		}),
	},
	tile: {
		map: r.one.map({
			from: r.tile.fkMap,
			to: r.map.id
		}),
	},
}))