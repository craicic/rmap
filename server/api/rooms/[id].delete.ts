import { eq } from 'drizzle-orm';
import { db } from "~~/server/database/client";
import { room } from "~~/server/database/migrations/schema";

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, message: 'Invalid id' });
  }

  const [existing] = await db.select({ id: room.id }).from(room).where(eq(room.id, id));
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Room not found' });
  }

  await db.delete(room).where(eq(room.id, id));
  return { success: true };
});
