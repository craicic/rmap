import { eq } from 'drizzle-orm';
import { db } from '~~/server/database/client';
import { room, users } from '~~/server/database/schema';

class RoomService {
    async getRoomById(id: number) {
        const [existingRoom] = await db.select().from(room).where(eq(room.id, id));
        return existingRoom || null;
    }

    async updateRoom(id: number, data: Partial<typeof room.$inferInsert>) {
        await db.update(room).set(data).where(eq(room.id, id));

        return this.getRoomById(id);
    }

    async verifyOwnerExists(ownerId: number) {
        const [owner] = await db.select().from(users).where(eq(users.id, ownerId));
        return owner || null;
    }

    async isRoomOwner(userId: number, roomId: number) {
        const roomData = await this.getRoomById(roomId);
        return roomData && roomData.fkOwner === userId;
    }

    async deleteRoom(id: number) {
        await db.delete(room).where(eq(room.id, id));
    }
}

// Export singleton instance
export const roomService = new RoomService();
