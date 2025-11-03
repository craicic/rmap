import { z } from 'zod';
import { createUpdateSchema } from 'drizzle-zod';
import { room } from '~~/server/database/schema';
import auth from '~~/server/services/auth';
import { roomService } from '~~/server/services/room.service';

// Update schema: all fields optional; apply overrides where needed
const bodySchema = createUpdateSchema(room, {
    url: z.url().optional(),
    fkOwner: z.number().int(),
}).refine((data) => Object.keys(data).length > 1, { message: 'No fields to update' });

export default defineEventHandler(async (event) => {
    const idParam = getRouterParam(event, 'id');
    const id = Number(idParam);

    if (!id || Number.isNaN(id)) {
        throw createError({ statusCode: 400, message: 'Invalid id' });
    }

    const patch = await readValidatedBody(event, bodySchema.parse);

    // Ensure room exists
    const existing = await roomService.getRoomById(id);
    if (!existing) {
        throw createError({ statusCode: 404, message: 'Room not found' });
    }

    // Verify fkOwner exists
    const owner = await roomService.verifyOwnerExists(patch.fkOwner);
    if (!owner) {
        throw createError({ statusCode: 400, message: 'Invalid fkOwner' });
    }

    // Ensure the user is the owner
    const user = await auth.user(event);
    if (!user || user.id !== owner.id) {
        throw createError({ statusCode: 403, message: 'Unauthorized' });
    }

    const updated = await roomService.updateRoom(id, patch as any);
    return updated;
});