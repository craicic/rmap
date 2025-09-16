import '#auth-utils';

declare module '#auth-utils' {
    interface User {
        github?: string

        name?: string
        email?: string
        password?: string
    }

    interface UserSession {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        extended?: any
        jwt?: {
            accessToken: string
            refreshToken: string
        }
        loggedInAt: number
    }

     // SecureSessionData

}

export {}
