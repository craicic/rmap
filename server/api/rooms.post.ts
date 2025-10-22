import { z } from 'zod';
import { db } from "~~/server/database/client";
import { room } from "~~/server/database/migrations/schema";

const bodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url().optional(),
  fkOwner: z.number().int(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  const [created] = await db.insert(room)
    .values(body as any)
    .returning();

  if (!created) {
    throw createError({ statusCode: 500, message: 'Failed to create room' });
  }
  return created;
});
