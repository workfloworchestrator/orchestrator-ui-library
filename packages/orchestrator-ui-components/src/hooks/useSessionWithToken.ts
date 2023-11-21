import { Session } from 'next-auth';
import { UseSessionOptions, useSession } from 'next-auth/react';

export type SessionToken = Session & {
    accessToken?: string;
};

export const useSessionWithToken = (
    options?: UseSessionOptions<boolean> | undefined,
) => {
    const sessionData = useSession(options);
    const dataWithToken = sessionData.data as SessionToken;
    return { ...sessionData, session: dataWithToken };
};
