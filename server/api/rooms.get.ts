import { db } from "~~/server/database/client";
import { room } from "~~/server/database/migrations/schema";

export default defineEventHandler(async () => {
  const list = await db.select().from(room);
  return list;
});
