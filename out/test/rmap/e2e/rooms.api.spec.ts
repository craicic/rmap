import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from 'vitest';
import {$fetch, setup} from '@nuxt/test-utils/e2e';
import path from 'node:path';
import dotenv from 'dotenv';
import {closeTestDb, resetDb} from '../utils/db';

// Ensure test env is loaded (so Nuxt/Nitro and DB client see DATABASE_URL)
dotenv.config({path: path.resolve(process.cwd(), '.env.test')});

describe('GET /api/rooms (test database)', () => {
    beforeAll(async () => {
        // Boot a Nuxt server once for this test suite
        await setup({
            server: true,
        });
        await resetDb();
    });

    beforeEach(async () => {
        await resetDb();
    });

    afterEach(async () => {
        // Optionally, could truncate here if you need stricter isolation
    });

    afterAll(async () => {
        await closeTestDb();
    });

    it('returns seeded rooms from data.sql', async () => {
        const rooms = (await $fetch('/api/rooms')) as Array<{
            id: number;
            name: string;
            description: string | null;
            url: string | null;
            fkOwner: number;
        }>;
        expect(Array.isArray(rooms)).toBe(true);
        expect(rooms.length).toBe(2);

        const names = rooms.map((r) => r.name).sort();
        expect(names).toEqual(
            ["Dragon's Lair Campaign - Lobby", 'Midnight Heist Planning Room'].sort(),
        );

        // Also verify urls to ensure seed consistency
        const urls = rooms.map((r) => r.url).sort();
        expect(urls).toEqual(['dragons-lair-lobby', 'midnight-heist-lobby'].sort());
    });
});
