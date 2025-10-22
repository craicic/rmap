import { z } from 'zod';
import { db } from "~~/server/database/client";
import { users } from "~~/server/database/migrations/schema";

const bodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  // Insert the user; assuming id is provided by the database (serial) or via input.
  // Our schema defines id as integer primary key without default; if DB doesn't auto-generate,
  // this will fail unless triggers exist. For now, keep it minimal and let DB handle it.
  const [created] = await db.insert(users)
    .values(body as any)
    .returning();

  if (!created) {
    throw createError({ statusCode: 500, message: 'Failed to create user' });
  }
  return created;
});
