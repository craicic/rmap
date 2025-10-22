import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from "~~/server/database/client";
import { users } from "~~/server/database/migrations/schema";

const bodySchema = z.object({
  username: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
  email: z.string().email().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id');
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) {
    throw createError({ statusCode: 400, message: 'Invalid id' });
  }

  const patch = await readValidatedBody(event, bodySchema.parse);

  const { rowCount } = await db.update(users)
    .set(patch as any)
    .where(eq(users.id, id));

  if (!rowCount) {
    // drizzle update with node-postgres returns no rowCount directly; do a select to confirm
    const [exists] = await db.select({ id: users.id }).from(users).where(eq(users.id, id));
    if (!exists) {
      throw createError({ statusCode: 404, message: 'User not found' });
    }
  }

  const [updated] = await db.select().from(users).where(eq(users.id, id));
  return updated;
});
