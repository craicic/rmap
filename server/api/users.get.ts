import { eq } from 'drizzle-orm';
import { db } from "~~/server/database/client";
import { users } from "~~/server/database/migrations/schema";

export default defineEventHandler(async (event) => {
  // Basic list endpoint. In the future, add pagination/filtering if needed.
  const list = await db.select().from(users);
  return list;
});
