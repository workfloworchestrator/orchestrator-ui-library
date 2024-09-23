import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import type { UseSessionOptions } from 'next-auth/react';

export type WfoSession = Session & {
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshTokenExpiresAt?: number;
    profile?: WfoUserProfile;
};

export type WfoUserProfile = {
    sub: string;
    name: string;
    preferred_username: string;
    email: string;
    [key: string]: unknown;
};

export const useWfoSession = <R extends boolean>(
    options?: UseSessionOptions<R>,
) => {
    const sessionData = useSession(options);

    // Data prop of type Session from NextAuth endpoint is not properly typed
    const { data, ...updatedSessionData } = sessionData;
    const dataWithToken = data as WfoSession | null;

    return { ...updatedSessionData, session: dataWithToken };
};
