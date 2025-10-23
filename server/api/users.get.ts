import {db} from "~~/server/database/client";
import {users} from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
    return db.select().from(users);
});
