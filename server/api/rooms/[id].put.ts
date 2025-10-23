import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createUpdateSchema } from 'drizzle-zod';
import { db } from "~~/server/database/client";
import { room } from "~~/server/database/schema";

// Update schema: all fields optional; apply overrides where needed
const bodySchema = createUpdateSchema(room, {
  url: z.string().url().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, message: 'Invalid id' });
  }

  const patch = await readValidatedBody(event, bodySchema.parse);

  // Ensure exists
  const [existing] = await db.select({ id: room.id }).from(room).where(eq(room.id, id));
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Room not found' });
  }

  await db.update(room)
    .set(patch as any)
    .where(eq(room.id, id));

  const [updated] = await db.select().from(room).where(eq(room.id, id));
  return updated;
});
