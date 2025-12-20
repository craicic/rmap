import type { H3Event } from 'h3';
import type { User } from '~~/types/user';
import type { UserSession } from '#auth-utils';
import users from '~~/server/database/schema';
import { eq } from 'drizzle-orm';
import { db } from '~~/server/database/client';

function hasUserId(u: unknown): u is { id: number } {
    return !!u && typeof (u as any).id === 'number';
}

// Logs the user in as the given user model
async function login(event: H3Event<Request>, user: User) {
    await replaceUserSession(event, {
        user: {
            id: user.id,
            name: user.name,
        },
        loggedInAt: new Date(),
    });
}

async function getCurrentUser(event: H3Event<Request>) {
    const session: UserSession = await getUserSession(event);

    // return null if there's no user or it does not include a numeric id
    if (!session.user || !hasUserId(session.user)) {
        return null;
    }

    const userId = session.user.id;

    // we're getting the whole user object by default for convenience, but always remove the password
    const result = (await db.select().from(users).where(eq(users.id, userId)).limit(1))?.[0];

    if (!result) {
        return null;
    }
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
}

async function attempt(event: H3Event<Request>, email: string, password: string) {
    const foundUser = (
        await db
            .select({
                id: users.id,
                name: users.username,
                email: users.email,
                password: users.password,
            })
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
    )?.[0];

    // compare the password hash
    if (!foundUser || !(await verifyPassword(password, foundUser.password))) {
        // return an error if the user is not found or the password doesn't match
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid email or password',
        });
    }

    // log in as the selected user
    await login(event, foundUser);

    return true;
}

export default {
    login,
    user: getCurrentUser,
    attempt,
};
