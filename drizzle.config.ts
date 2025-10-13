import { defineConfig } from 'drizzle-kit'


export default defineConfig({
    dialect: 'postgresql',
    schema: './server/database/schema.ts',
    out: './server/database/migrations',
    dbCredentials: {
        url: "postgres://postgres:wLAkMtsqyADTmDiMO4q1@localhost:5432/rmap_db",
    },
})