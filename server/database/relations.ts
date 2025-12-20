import { relations } from 'drizzle-orm/relations';
import { users, room, map, image, layer, marker, roomUsers } from './schema';

export const roomRelations = relations(room, ({ one, many }) => ({
    user: one(users, {
        fields: [room.fkOwner],
        references: [users.id],
    }),
    maps: many(map),
    roomUsers: many(roomUsers),
}));

export const usersRelations = relations(users, ({ many }) => ({
    rooms: many(room),
    roomUsers: many(roomUsers),
}));

export const mapRelations = relations(map, ({ one, many }) => ({
    room: one(room, {
        fields: [map.fkRoom],
        references: [room.id],
    }),
    image: one(image, {
        fields: [map.fkFile],
        references: [image.id],
    }),
    layers: many(layer),
    markers: many(marker),
}));

export const imageRelations = relations(image, ({ many }) => ({
    maps: many(map),
    markers: many(marker),
}));

export const layerRelations = relations(layer, ({ one }) => ({
    map: one(map, {
        fields: [layer.fkMap],
        references: [map.id],
    }),
}));

export const markerRelations = relations(marker, ({ one }) => ({
    map: one(map, {
        fields: [marker.fkMap],
        references: [map.id],
    }),
    image: one(image, {
        fields: [marker.fkImage],
        references: [image.id],
    }),
}));

export const roomUsersRelations = relations(roomUsers, ({ one }) => ({
    room: one(room, {
        fields: [roomUsers.fkRoom],
        references: [room.id],
    }),
    user: one(users, {
        fields: [roomUsers.fkPlayer],
        references: [users.id],
    }),
}));
