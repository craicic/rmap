import { eq } from 'drizzle-orm';
import { db } from "~~/server/database/client";
import { room } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, message: 'Invalid id' });
  }
  const [item] = await db.select().from(room).where(eq(room.id, id));
  if (!item) {
    throw createError({ statusCode: 404, message: 'Room not found' });
  }
  return item;
});
