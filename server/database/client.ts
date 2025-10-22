import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Load env from .env if present (Nuxt typically already loads env)
const { DATABASE_URL } = process.env as { DATABASE_URL?: string };

if (!DATABASE_URL) {
  // It's useful to fail early during development if env is missing
  // Handlers can still import db; the error will surface on first query
  console.warn('[database] DATABASE_URL is not set. Set it in your environment to enable DB access.');
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle(pool);

export type DB = typeof db;
