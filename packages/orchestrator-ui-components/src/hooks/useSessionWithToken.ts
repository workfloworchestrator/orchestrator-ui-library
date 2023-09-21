import { useSession, UseSessionOptions } from 'next-auth/react';
import { Session } from 'next-auth';

export type SessionToken = Session & {
    accessToken?: unknown;
};

export const useSessionWithToken = (
    options?: UseSessionOptions<boolean> | undefined,
) => {
    const sessionData = useSession(options);
    const dataWithToken = sessionData.data as SessionToken;
    return { ...sessionData, session: dataWithToken };
};
