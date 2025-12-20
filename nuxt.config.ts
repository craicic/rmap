// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint', '@nuxt/test-utils', 'nuxt-auth-utils', '@nuxt/ui'],
    runtimeConfig: {
        public: {
            minicondaDir: process.env.MINICONDA_DIR,
            mapsDir: process.env.MAPS_DIR,
        },
    },
});
