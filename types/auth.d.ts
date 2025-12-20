// Augment nuxt-auth-utils types so session.user has a numeric id.
// Some environments resolve the types through the virtual module '#auth-utils',
// others through the package name 'nuxt-auth-utils'. We augment both to be safe.

declare module '#auth-utils' {
    export interface User {
        id: number;
        name?: string;
        email?: string;
    }
    export interface UserSession {
        user?: User;
    }
}

declare module 'nuxt-auth-utils' {
    export interface User {
        id: number;
        name?: string;
        email?: string;
    }
    export interface UserSession {
        user?: User;
    }
}

export {};
