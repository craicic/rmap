import auth from '~~/server/services/auth';

export default defineEventHandler(async (event) => {
	await requireUserSession(event);

	const user = await auth.user(event);
	if (!user) {
		throw createError({ statusCode: 401, message: 'Unauthorized' });
	}
	return {
		id: user.id,
		name: user.username,
		email: user.email,
	};
});
