import { roomService } from '~~/server/services/room.service';
import auth from '~~/server/services/auth';

export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, 'id'));
	const user = await auth.user(event);

	if (!user || !(await roomService.isRoomOwner(user.id, id))) {
		throw createError({ statusCode: 403, message: 'Unauthorized' });
	}

	const existing = await roomService.getRoomById(id);
	if (!existing) {
		throw createError({ statusCode: 404, message: 'Room not found' });
	}
	await roomService.deleteRoom(existing.id);
});
