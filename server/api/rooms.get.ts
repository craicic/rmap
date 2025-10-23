import {db} from "~~/server/database/client";
import {room} from "~~/server/database/schema";

export default defineEventHandler(async () => {
    return db.select().from(room);
});
