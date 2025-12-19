import users from '~~/server/database/schema';
import { db } from '~~/server/database/client';
import { eq } from 'drizzle-orm';
import auth from '~~/server/services/auth';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const bodySchema = createInsertSchema(users, {
	id: z.number().int().optional(),
	username: z.string().min(1),
	password: z.string().min(8),
	email: z.email(),
});

export default defineEventHandler(async (event) => {
	// read the body of the request
	const body = await readValidatedBody(event, bodySchema.parse);

	// hash the password before storing it in the database
	body.password = await hashPassword(body.password);

	// insert the user into the database
	await db.insert(users).values(body as any);

	// log the user in as the user that was just created
	const user = (await db.select().from(users).where(eq(users.email, body.email)).limit(1))[0];
	await auth.login(event, user);
});
