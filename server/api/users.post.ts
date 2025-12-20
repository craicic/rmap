import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { db } from '~~/server/database/client';
import { users } from '~~/server/database/schema';

const bodySchema = createInsertSchema(users, {
    id: z.number().int().optional(),
    username: z.string().min(1),
    password: z.string().min(8),
    email: z.string().email(),
});

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, bodySchema.parse);

    const [created] = await db
        .insert(users)
        .values(body as any)
        .returning();

    if (!created) {
        throw createError({ statusCode: 500, message: 'Failed to create user' });
    }
    return created;
});
