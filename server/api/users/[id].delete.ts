import { eq } from 'drizzle-orm';
import { db } from "~~/server/database/client";
import { users } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, message: 'Invalid id' });
  }

  // Ensure exists
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.id, id));
  if (!existing) {
    throw createError({ statusCode: 404, message: 'User not found' });
  }

  await db.delete(users).where(eq(users.id, id));
  return { success: true };
});
