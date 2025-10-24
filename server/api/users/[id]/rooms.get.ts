import { db } from "~~/server/database/client";
import { room, roomUsers } from "~~/server/database/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import auth from "~~/server/services/auth";

const paramsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform((v) => Number(v)),
});

export default defineEventHandler(async (event) => {

    const parsed = paramsSchema.safeParse(event.context.params);
    if (!parsed.success) {
        throw createError({ statusCode: 400, message: "Invalid user id" });
    }

    // Ensure user exists
    const existingUser = await auth.user(event);
    if (!existingUser) {
        throw createError({ statusCode: 404, message: "User not found" });
    }
    const userId = existingUser.id

    // Rooms where the user is the owner
    const ownerRooms = await db
        .select()
        .from(room)
        .where(eq(room.fkOwner, userId));

    // Rooms where the user is a player (via room_users)
    const playerRooms = await db
        .select({ id: room.id, name: room.name, description: room.description, url: room.url, fkOwner: room.fkOwner })
        .from(roomUsers)
        .innerJoin(room, eq(roomUsers.fkRoom, room.id))
        .where(eq(roomUsers.fkPlayer, userId));

    return {
        owner: ownerRooms,
        player: playerRooms,
    };
});