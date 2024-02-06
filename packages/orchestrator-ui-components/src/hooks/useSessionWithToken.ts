import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import type { UseSessionOptions } from 'next-auth/react';

export type WfoSession = Session & {
    accessToken?: string;
    profile?: WfoUserProfile;
};

export type WfoUserProfile = {
    sub: string;
    name: string;
    preferred_username: string;
    email: string;
    [key: string]: unknown;
};

// Todo rename this to useWfoSession and remove the use of useSession in the project
export const useSessionWithToken = () => {
    const sessionData = useSession();
    const dataWithToken = sessionData.data as WfoSession;
    return { ...sessionData, session: dataWithToken };
};

export const useWfoSession = <R extends boolean>(
    options?: UseSessionOptions<R>,
) => {
    const sessionData = useSession(options);

    // Data prop of type Session from NextAuth endpoint is not properly typed
    const { data, ...updatedSessionData } = sessionData;
    const dataWithToken = data as WfoSession;

    return { ...updatedSessionData, session: dataWithToken };
};
