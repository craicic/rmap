import {drizzle} from 'drizzle-orm/node-postgres';

const {DATABASE_URL} = process.env as { DATABASE_URL: string };

export const db = drizzle(DATABASE_URL);

export type DB = typeof db;
