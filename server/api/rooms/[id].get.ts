import { roomService } from '~~/server/services/room.service';

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'));
    const room = await roomService.getRoomById(id);

    if (!room) {
        throw createError({ statusCode: 404, message: 'Room not found' });
    }

    return room;
});
