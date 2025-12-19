import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { db } from '~~/server/database/client';
import { room, users } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

const bodySchema = createInsertSchema(room, {
	id: z.number().int().optional(),
	name: z.string().min(1),
	description: z.string().optional(),
	url: z.url().optional(),
	fkOwner: z.number().int(),
});

export default defineEventHandler(async (event) => {
	const body = await readValidatedBody(event, bodySchema.parse);

	// Verify fkOwner exists
	const owner = await db.select().from(users).where(eq(users.id, body.fkOwner));
	if (!owner) {
		throw createError({ statusCode: 400, message: 'Invalid fkOwner' });
	}

	const [created] = await db
		.insert(room)
		.values(body as any)
		.returning();

	if (!created) {
		throw createError({ statusCode: 500, message: 'Failed to create room' });
	}
	return created;
});
