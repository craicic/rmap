import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import {Pool} from 'pg';

// Ensure we load the test env before creating a Pool
if (!process.env.DATABASE_URL) {
    // Try loading from .env.test by default
    dotenv.config({path: path.resolve(process.cwd(), '.env.test')});
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    // Let tests fail clearly if env is missing
    throw new Error('DATABASE_URL is not set. Please configure .env.test for running DB tests.');
}

// Use a dedicated pool for test utilities to avoid interfering with app pool lifecycle
const pool = new Pool({connectionString});

export async function resetDb() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Truncate all tables that may be referenced by seed script; use CASCADE to satisfy FKs
        await client.query(`
      TRUNCATE TABLE
        room_users,
        room,
        users
      RESTART IDENTITY CASCADE;
    `);

        // Load and execute the seed SQL
        const seedPath = path.resolve(process.cwd(), 'server/database/data.sql');
        const sql = fs.readFileSync(seedPath, 'utf8');
        await client.query(sql);

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export async function closeTestDb() {
    await pool.end();
}
